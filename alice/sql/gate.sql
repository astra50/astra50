-- name: Gates :many
SELECT *
FROM public.gate;
;

-- name: GateOpenInsert :one
INSERT INTO public.gate_open (gate_id,
                              reason_id,
                              source)
VALUES (@gate_id,
        @reason_id,
        @source)
RETURNING *
;
