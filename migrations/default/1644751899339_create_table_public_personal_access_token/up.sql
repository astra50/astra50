ALTER TABLE public.gate ADD COLUMN identifier text DEFAULT NULL
    UNIQUE;
UPDATE public.gate
   SET identifier = CASE WHEN id = '31a3b0ab-efda-4a1c-badb-6b29d4ace8f5' THEN 'south' ELSE 'north' END
 WHERE identifier IS NULL;
ALTER TABLE public.gate ALTER identifier SET NOT NULL;

CREATE TABLE public.personal_access_token
    (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        name text NOT NULL,
        token text DEFAULT REPLACE(gen_random_uuid()::text, '-', ''),
        gate_access boolean NOT NULL,
        person_id uuid NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (person_id) REFERENCES public.person (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT public.timestampable('public.personal_access_token');
SELECT audit.audit_table('public.personal_access_token');

INSERT INTO public.gate_open_reason (id, name)
VALUES ('token', 'Персональный токен');

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
