// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sql

import (
	"context"
)

type Querier interface {
	GateOne(ctx context.Context, arg GateOneParams) (Gate, error)
	GateOpenInsert(ctx context.Context, arg GateOpenInsertParams) (GateOpen, error)
	Gates(ctx context.Context) ([]Gate, error)
}

var _ Querier = (*Queries)(nil)
