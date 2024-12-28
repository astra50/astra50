package postgres

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/astra50/astra50/alice/internal/sql"
)

func Pool(ctx context.Context, dsn string) (context.Context, func(), error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return ctx, nil, fmt.Errorf("pgx.Connect: %w", err)
	}

	ctx = sql.WithContext(ctx, pool)

	cancelF := func() {
		pool.Close()
	}

	return ctx, cancelF, nil
}
