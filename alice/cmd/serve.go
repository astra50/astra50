package cmd

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/MicahParks/keyfunc"
	"github.com/astra50/astra50/alice/internal/sql"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/spf13/cobra"
	"golang.org/x/sync/errgroup"

	"github.com/astra50/astra50/alice/internal/log"
	"github.com/astra50/astra50/alice/internal/postgres"
)

const UserIDKey = "user_id"

func init() {
	rootCmd.AddCommand(serveCmd)
}

var serveCfg = struct {
	Http struct {
		Addr  string `env:"HTTP_ADDR" env-default:":8080"`
		Paths struct {
			Health string `env:"HTTP_HEALTH_PATH" env-default:"/health"`
		}
	}
	JWKS_URL                string        `env:"JWKS_URL" env-required:"true"`
	PostgresURI             string        `env:"POSTGRES_URI" env-required:"true"`
	GracefulShutdownTimeout time.Duration `env:"GRACEFUL_SHUTDOWN_TIMEOUT" env-default:"5s"`
}{}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start api",
	PreRunE: func(cmd *cobra.Command, args []string) error {
		cfg := &serveCfg // alias

		configFile := ".env"
		if len(args) > 0 {
			configFile = args[0]
		}

		if err := cleanenv.ReadConfig(configFile, cfg); err != nil {
			if !errors.Is(err, fs.ErrNotExist) {
				return fmt.Errorf("cleanenv.ReadConfig: %w", err)
			}

			if err := cleanenv.ReadEnv(cfg); err != nil {
				return fmt.Errorf("cleanenv.ReadEnv: %w", err)
			}
		}

		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg := serveCfg // alias

		ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
		defer stop()

		ctx, cancelPool, err := postgres.Pool(ctx, cfg.PostgresURI)
		if err != nil {
			return fmt.Errorf("pgpool: %w", err)
		}
		defer cancelPool()

		httpSrv := &http.Server{Addr: cfg.Http.Addr}
		{
			r := gin.New()

			r.ContextWithFallback = true

			r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
				SkipPaths: []string{
					"/health",
				},
			}))

			r.Use(gin.Recovery())
			r.Use(Jwks(ctx, cfg.JWKS_URL))

			r.Use(func(c *gin.Context) {
				c.Request = c.Request.WithContext(sql.WithContext(c.Request.Context(), sql.FromContext(ctx)))
			})

			r.GET(cfg.Http.Paths.Health, func(c *gin.Context) {
				c.Status(http.StatusOK)
			})

			{
				v1 := r.Group("v1.0")

				v1.HEAD("/", func(c *gin.Context) {
					c.Status(http.StatusOK)
				})

				user := v1.Group("/user")
				user.Use(func(c *gin.Context) {
					userId := c.GetString(UserIDKey)
					if userId == "" {
						log.Warn(ctx, "Unauthorized")

						c.AbortWithStatus(http.StatusUnauthorized)

						return
					}

					log.Info(ctx, "Authorized", log.String(UserIDKey, userId))
				})

				user.POST("/unlink", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{"request_id": c.GetHeader("X-Request-Id")})
				})

				devices := user.Group("/devices")

				devices.GET("", func(c *gin.Context) {
					gates, err := sql.Gates(c)
					if err != nil {
						log.Error(c, "sql.Gates", err)

						c.AbortWithStatus(http.StatusInternalServerError)

						return
					}

					devs := make([]Device, 0, len(gates))
					for _, gate := range gates {
						devs = append(devs, Device{
							ID: gate.ID.String(),
							Name: func() string {
								switch gate.Number.Int32 {
								case 1:
									return "Первые ворота"
								case 2:
									return "Вторые ворота"
								default:
									return gate.Name
								}
							}(),
							Description: "Ворота",
							Room:        "СНТ Астра",
							Type:        "devices.types.openable",
							Capabilities: []Capability{
								{
									Type:        "devices.capabilities.on_off",
									Retrievable: false,
									Parameters:  map[string]string{},
								},
							},
						})
					}

					c.JSON(http.StatusOK, gin.H{
						"request_id": c.GetHeader("X-Request-Id"),
						"payload": gin.H{
							"user_id": c.GetString(UserIDKey),
							"devices": devs,
						},
					})
				})

				devices.POST("/query", func(c *gin.Context) {
					var req struct {
						Devices []struct {
							ID   string `json:"id"`
							Data any    `json:"custom_data"`
						} `json:"devices"`
					}

					if err := c.ShouldBindJSON(&req); err != nil {
						log.Error(ctx, "c.ShouldBindJSON", err)

						return
					}

					res := Response{}
					res.RequestID = c.GetHeader("X-Request-Id")

					for i, device := range req.Devices {
						res.Payload.Devices = append(res.Payload.Devices, Device{ID: device.ID})
						device := &res.Payload.Devices[i]

						params := sql.GateOneParams{}

						if err := params.ID.Scan(device.ID); err != nil {
							log.Error(ctx, "params.ID.Scan", err)

							c.AbortWithStatus(http.StatusInternalServerError)

							return
						}

						_, err := sql.GateOne(ctx, params)
						if err != nil {
							log.Error(ctx, "sql.GateOne", err)

							res.Payload.Devices[i].ActionResult.Status = "ERROR"
							res.Payload.Devices[i].ActionResult.ErrorCode = "DEVICE_UNREACHABLE"

							continue
						}
					}

					c.JSON(http.StatusOK, res)
				})

				devices.POST("/action", func(c *gin.Context) {
					var req struct {
						Payload struct {
							Devices []struct {
								ID           string `json:"id"`
								Capabilities []struct {
									Type  string `json:"type"`
									State struct {
										Instance string `json:"instance"`
										Value    bool   `json:"value"`
									} `json:"state"`
								} `json:"capabilities"`
							} `json:"devices"`
						} `json:"payload"`
					}

					if err := c.ShouldBindJSON(&req); err != nil {
						log.Error(ctx, "c.ShouldBindJSON", err)

						return
					}

					var res struct {
						RequestID string `json:"request_id"`
						Payload   struct {
							Devices []Device `json:"devices"`
						} `json:"payload"`
					}

					res.RequestID = c.GetHeader("X-Request-Id")

					for i, dev := range req.Payload.Devices {
						res.Payload.Devices = append(res.Payload.Devices, Device{ID: dev.ID})

						params := sql.GateOneParams{}

						if err := params.ID.Scan(dev.ID); err != nil {
							log.Error(ctx, "params.ID.Scan", err)

							c.AbortWithStatus(http.StatusInternalServerError)

							return
						}

						gate, err := sql.GateOne(ctx, params)
						if err != nil {
							log.Error(ctx, "sql.GateOne", err)

							res.Payload.Devices[i].ActionResult.Status = "ERROR"
							res.Payload.Devices[i].ActionResult.ErrorCode = "DEVICE_UNREACHABLE"

							continue
						}

						for _, capability := range dev.Capabilities {
							switch capability.Type {
							case "devices.capabilities.on_off":
								_, err = sql.GateOpenInsert(ctx, sql.GateOpenInsertParams{
									GateID:   gate.ID,
									ReasonID: "alice",
									Source:   c.GetString(UserIDKey),
								})
								if err != nil {
									log.Error(ctx, "sql.GateOpenInsert", err)

									res.Payload.Devices[i].Capabilities = append(
										res.Payload.Devices[i].Capabilities,
										Capability{
											Type: capability.Type,
											State: &State{
												Instance: capability.State.Instance,
												ActionResult: ActionResult{
													Status:    "ERROR",
													ErrorCode: "DEVICE_UNREACHABLE",
												},
											},
										},
									)

									continue
								}

								res.Payload.Devices[i].Capabilities = append(
									res.Payload.Devices[i].Capabilities,
									Capability{
										Type: capability.Type,
										State: &State{
											Instance: capability.State.Instance,
											ActionResult: ActionResult{
												Status: "DONE",
											},
										},
									},
								)
							default:
								log.Error(ctx, "unsupported capability", log.String("capability", capability.Type))

								res.Payload.Devices[i].Capabilities = append(
									res.Payload.Devices[i].Capabilities,
									Capability{
										Type: capability.Type,
										State: &State{
											Instance: capability.State.Instance,
											ActionResult: ActionResult{
												Status:    "ERROR",
												ErrorCode: "INTERNAL_ERROR",
											},
										},
									},
								)
							}
						}
					}

					c.JSON(http.StatusOK, res)
				})
			} // Yandex Alice

			httpSrv.Handler = r
		} // http routing

		go func() {
			log.Info(ctx, "http server starting")
			defer log.Info(ctx, "http server stopped")

			if err := httpSrv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				log.Error(ctx, "ListenAndServe", err)
			}
		}() // http server

		<-ctx.Done()

		{ // Graceful shutdown
			// Restore default behavior on the interrupt signal and notify user of shutdown.
			stop()
			log.Info(ctx, "shutting down gracefully, press Ctrl+C again to force")

			// The context is used to inform the server it has 5 seconds to finish
			// the request it is currently handling
			ctx, cancel := context.WithTimeout(ctx, cfg.GracefulShutdownTimeout)
			defer cancel()

			g, ctx := errgroup.WithContext(ctx)
			g.Go(func() error {
				if err := httpSrv.Shutdown(ctx); err != nil {
					log.Error(ctx, "httpSrv.Shutdown: ", err)
				}

				return nil
			})

			if err := g.Wait(); err != nil {
				log.Error(ctx, "graceful shutdown failed", err)
			}
		}

		log.Info(ctx, "Server exiting")

		return nil
	},
}

func Jwks(ctx context.Context, jwksURL string) func(c *gin.Context) {
	// Create the keyfunc options. Use an error handler that logs. Refresh the JWKS when a JWT signed by an unknown KID
	// is found or at the specified interval. Rate limit these refreshes. Timeout the initial JWKS refresh request after
	// 10 seconds. This timeout is also used to create the initial context.Context for keyfunc.Get.
	options := keyfunc.Options{
		RefreshErrorHandler: func(err error) {
			log.Error(ctx, "There was an error with the jwt.Keyfunc", err)
		},
		RefreshInterval:   time.Hour,
		RefreshRateLimit:  time.Minute * 5,
		RefreshTimeout:    time.Second * 10,
		RefreshUnknownKID: true,
	}

	// Create the JWKS from the resource at the given URL.
	jwks, err := keyfunc.Get(jwksURL, options) // See recommended options in the examples directory.
	if err != nil {
		log.Error(ctx, "Failed to get the JWKS from the given URL.", err)

		os.Exit(1)
	}

	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")

		if authHeader == "" {
			return // anonymous
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			log.Error(c, "Malformed token", log.String("header", authHeader))

			return
		}

		// Parse the JWT.
		token, err := jwt.Parse(headerParts[1], jwks.Keyfunc)
		if err != nil {
			log.Error(c, "Failed to parse the JWT", err)

			return
		}

		// Check if the token is valid.
		if !token.Valid {
			log.Error(c, "Token validation failed")

			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok { // Probably unreachable
			log.Error(c, "Token claims not readable")

			return
		}

		userId := claims["sub"].(string)

		c.Set(UserIDKey, userId)
	}
}
