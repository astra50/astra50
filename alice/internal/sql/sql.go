package sql

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ctxKey struct{}

func WithContext(ctx context.Context, p *pgxpool.Pool) context.Context {
	return context.WithValue(ctx, ctxKey{}, p)
}

func FromContext(ctx context.Context) *pgxpool.Pool {
	if v, ok := ctx.Value(ctxKey{}).(*pgxpool.Pool); ok {
		return v
	}

	return nil
}
