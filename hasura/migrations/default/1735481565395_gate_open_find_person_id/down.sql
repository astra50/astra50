CREATE OR REPLACE FUNCTION gate_open_find_person_id() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
BEGIN
    new.person_id = CASE
                        WHEN (new.reason_id = 'telephone')
                            THEN (SELECT person_id FROM public.person_phone WHERE phone = new.source)
                        WHEN (new.reason_id = 'telegram')
                            THEN (SELECT id FROM public.person WHERE telegram_id = new.source)
                        WHEN (new.reason_id = 'site')
                            THEN (SELECT person_id FROM public.person_email WHERE email = new.source)
                        WHEN (new.reason_id = 'app')
                            THEN (SELECT id FROM public.person WHERE user_id = new.source::uuid)
                        WHEN (new.reason_id = 'token') THEN (SELECT personal_access_token.person_id
                                                             FROM public.personal_access_token
                                                             WHERE id = new.source::uuid) END;

    RETURN new;
END;
$$;
