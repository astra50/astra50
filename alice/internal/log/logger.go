package log

import (
	"bytes"
	"context"
	"encoding/hex"
	"log/slog"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

type ctxKey struct{}

var defaultLogger = Default()

func Default() *slog.Logger {
	replace := func(groups []string, a slog.Attr) slog.Attr {
		// Remove the directory from the source's filename.
		if a.Key == slog.SourceKey {
			source := a.Value.Any().(*slog.Source)
			source.File = filepath.Base(source.File)
		}
		return a
	}

	return slog.New(
		slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
			AddSource:   true,
			ReplaceAttr: replace,
			Level:       slog.LevelDebug,
		}),
	)
}

func FromCtx(ctx context.Context) *slog.Logger {
	if l, ok := ctx.Value(ctxKey{}).(*slog.Logger); ok {
		return l
	}

	return defaultLogger
}

func WithCtx(ctx context.Context, l *slog.Logger) context.Context {
	if lp, ok := ctx.Value(ctxKey{}).(*slog.Logger); ok {
		if lp == l {
			return ctx
		}
	}

	return context.WithValue(ctx, ctxKey{}, l)
}

// Proxy methods

func With(ctx context.Context, fields ...any) context.Context {
	return WithCtx(ctx, FromCtx(ctx).With(fields...))
}

func Debug(ctx context.Context, msg string, fields ...any) { log(ctx, slog.LevelDebug, msg, fields...) }
func Info(ctx context.Context, msg string, fields ...any)  { log(ctx, slog.LevelInfo, msg, fields...) }
func Warn(ctx context.Context, msg string, fields ...any)  { log(ctx, slog.LevelWarn, msg, fields...) }
func Error(ctx context.Context, msg string, fields ...any) { log(ctx, slog.LevelError, msg, fields...) }

func log(ctx context.Context, level slog.Level, msg string, args ...any) {
	h := FromCtx(ctx).Handler()
	if !h.Enabled(ctx, level) {
		return
	}

	var pcs [1]uintptr
	runtime.Callers(3, pcs[:]) // skip [Callers]

	r := slog.NewRecord(time.Now(), level, msg, pcs[0])
	r.Add(normalizeAttrs(args)...)

	_ = h.Handle(context.Background(), r)
}

// Attrs

func String(key, value string) slog.Attr             { return slog.String(key, value) }
func Int64(key string, value int64) slog.Attr        { return slog.Int64(key, value) }
func Int(key string, value int) slog.Attr            { return slog.Int64(key, int64(value)) }
func Int32(key string, value int32) slog.Attr        { return slog.Int64(key, int64(value)) }
func Uint64(key string, v uint64) slog.Attr          { return slog.Uint64(key, v) }
func Float64(key string, v float64) slog.Attr        { return slog.Float64(key, v) }
func Bool(key string, v bool) slog.Attr              { return slog.Bool(key, v) }
func Time(key string, v time.Time) slog.Attr         { return slog.Time(key, v) }
func Duration(key string, v time.Duration) slog.Attr { return slog.Duration(key, v) }
func Group(key string, args ...any) slog.Attr        { return slog.Group(key, args...) }
func Any(key string, value any) slog.Attr            { return slog.Any(key, value) }

// UUID Can be removed in favor of log.String if https://github.com/jackc/pgx/pull/2145 merged
func UUID(key string, value [16]byte) slog.Attr {
	var buf [36]byte

	hex.Encode(buf[0:8], value[:4])
	buf[8] = '-'
	hex.Encode(buf[9:13], value[4:6])
	buf[13] = '-'
	hex.Encode(buf[14:18], value[6:8])
	buf[18] = '-'
	hex.Encode(buf[19:23], value[8:10])
	buf[23] = '-'
	hex.Encode(buf[24:], value[10:])

	return slog.String(key, string(buf[:]))
}

func normalizeAttrs(args []any) []any {
	for i, a := range args {
		switch a := a.(type) {
		case error:
			stack := make([]byte, 8192)
			n := runtime.Stack(stack, false)

			nl := 0
			loggerTrace := bytes.IndexFunc(stack, func(r rune) bool {
				if r == '\n' {
					nl++
				}

				// 1 first line and 6 is logger stack
				// goroutine 27 [running]:
				// github.com/astra50/astra50/alice/internal/log.normalizeAttrs({0xc000793fc0, 0x1, 0x1})
				// \t/go/src/app/internal/log/logger.go:102 +0x12f
				// github.com/astra50/astra50/alice/internal/log.log({0x123fe98, 0xc0001326c0}, 0x8, {0x10931cb, 0x6}, {0xc000793fc0, 0x1, 0x1})
				// \t/go/src/app/internal/log/logger.go:79 +0x1b0
				// github.com/astra50/astra50/alice/internal/log.Error(...)
				// \t/go/src/app/internal/log/logger.go:67
				if nl > 7 {
					return true
				}

				return false
			})

			stack = append(stack[:bytes.Index(stack, []byte("\n"))], stack[loggerTrace:n]...)

			args[i] = slog.Group("error",
				slog.String("message", a.Error()),
				slog.String("stacktrace", string(stack)),
			)
		}
	}

	return args
}
