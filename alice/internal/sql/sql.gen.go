// Code generated by "generate/sql"; DO NOT EDIT.

package sql

import "context"

func GateOne(ctx context.Context, arg GateOneParams) (Gate, error) {
	return New(FromContext(ctx)).GateOne(ctx, arg)
}

func GateOpenInsert(ctx context.Context, arg GateOpenInsertParams) (GateOpen, error) {
	return New(FromContext(ctx)).GateOpenInsert(ctx, arg)
}

func Gates(ctx context.Context) ([]Gate, error) {
	return New(FromContext(ctx)).Gates(ctx)
}
