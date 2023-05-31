DROP FUNCTION public.open_gate(token text, gate text);
CREATE OR REPLACE FUNCTION public.open_gate(token text, gate uuid) RETURNS setof gate_open AS
$$
DECLARE
    _token    public.personal_access_token;
    last_open public.gate_open;
    _gate     public.gate;
BEGIN
    SELECT * INTO _token FROM personal_access_token pat WHERE pat.token = $1;
    SELECT * INTO _gate FROM public.gate WHERE id = $2;

    IF _token IS NULL THEN RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'Unauthorized'; END IF;
    IF NOT _token.gate_access THEN RAISE EXCEPTION USING ERRCODE = '0P000', MESSAGE = 'Unauthorized'; END IF;

    SELECT * INTO last_open FROM public.gate_open WHERE source = _token.id::text ORDER BY created_at DESC LIMIT 1;

    IF NOW() < last_open.created_at + INTERVAL '1 second' * _gate.delay THEN
        RAISE EXCEPTION 'Too many requests';
    END IF;

    RETURN QUERY WITH inserted_row AS (INSERT INTO public.gate_open (gate_id, reason_id, source) VALUES ($2,
                                                                                                         'token',
                                                                                                         _token.id) RETURNING *)
               SELECT *
                 FROM inserted_row;

END
$$ LANGUAGE plpgsql;

ALTER TABLE gate DROP COLUMN identifier;
