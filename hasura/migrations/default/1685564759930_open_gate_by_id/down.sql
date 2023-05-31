ALTER TABLE public.gate ADD identifier text;
UPDATE public.gate
   SET identifier = id
 WHERE identifier IS NULL;
CREATE UNIQUE INDEX gate_identifier_key ON public.gate (identifier);
ALTER TABLE public.gate ALTER COLUMN identifier SET NOT NULL;

DROP FUNCTION public.open_gate(token text, gate uuid);
CREATE OR REPLACE FUNCTION public.open_gate(token text, gate text) RETURNS setof gate_open AS
$$
DECLARE
    token_record record;
    last_open    record;
BEGIN
    SELECT * INTO token_record FROM personal_access_token pat WHERE pat.token = $1;

    IF token_record IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;

    SELECT * INTO last_open FROM public.gate_open WHERE source = token_record.id::text ORDER BY created_at DESC LIMIT 1;

    IF last_open.created_at > (NOW() - INTERVAL '30 second') THEN RAISE EXCEPTION 'Too many requests'; END IF;

    RETURN QUERY WITH inserted_row
                          AS (INSERT INTO public.gate_open (gate_id, reason_id, source) VALUES ((SELECT id FROM gate WHERE identifier = $2),
                                                                                                'token',
                                                                                                token_record.id) RETURNING *)
               SELECT *
                 FROM inserted_row;

END
$$ LANGUAGE plpgsql;


