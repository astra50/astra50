CREATE OR REPLACE FUNCTION public.open_gate_site(gate text) RETURNS setof gate_open
    LANGUAGE plpgsql AS
$$
DECLARE
    session_variables jsonb;
BEGIN
    session_variables := CURRENT_SETTING('hasura.user', 't');

    RETURN QUERY WITH inserted_row AS (INSERT INTO public.gate_open (gate_id, reason_id, source) VALUES (gate::uuid,
                                                                                                         'site',
                                                                                                         session_variables ->>
                                                                                                         'x-hasura-user-id') RETURNING *)
               SELECT *
                 FROM inserted_row;

END
$$;

UPDATE public.gate_open
   SET reason_id = 'site'
 WHERE reason_id = 'app';

DELETE
  FROM public.gate_open_reason
 WHERE id = 'app';


CREATE OR REPLACE FUNCTION gate_open_find_person_id() RETURNS trigger
    LANGUAGE plpgsql AS
$$
BEGIN
    new.person_id = CASE WHEN (new.reason_id = 'telephone')
                             THEN (SELECT person_id FROM public.person_phone WHERE phone = new.source)
                         WHEN (new.reason_id = 'telegram')
                             THEN (SELECT id FROM public.person WHERE telegram_id = new.source)
                         WHEN (new.reason_id = 'site')
                             THEN (SELECT person_id FROM public.person_email WHERE email = new.source)
                         WHEN (new.reason_id = 'token') THEN (SELECT personal_access_token.person_id
                                                                FROM public.personal_access_token
                                                               WHERE id = new.source::uuid) END;

    RETURN new;
END;
$$;
