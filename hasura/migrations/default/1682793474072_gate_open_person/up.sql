ALTER TABLE gate_open ADD COLUMN person_id uuid
    REFERENCES public.person (id);

CREATE INDEX ON gate_open (person_id);

---

CREATE FUNCTION public.gate_open_find_person_id() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS

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

CREATE TRIGGER gate_open_find_person_id
    BEFORE INSERT
    ON public.gate_open
    FOR EACH ROW
EXECUTE PROCEDURE public.gate_open_find_person_id();

---

UPDATE public.gate_open
   SET person_id = (CASE WHEN (public.gate_open.reason_id = 'telephone') THEN (SELECT person_id
                                                                                 FROM public.person_phone
                                                                                WHERE phone = public.gate_open.source)
                         WHEN (public.gate_open.reason_id = 'telegram') THEN (SELECT id
                                                                                FROM public.person
                                                                               WHERE telegram_id = public.gate_open.source)
                         WHEN (public.gate_open.reason_id = 'site') THEN (SELECT person_id
                                                                            FROM public.person_email
                                                                           WHERE email = public.gate_open.source)
                         WHEN (public.gate_open.reason_id = 'token') THEN (SELECT personal_access_token.person_id
                                                                             FROM public.personal_access_token
                                                                            WHERE id = public.gate_open.source::uuid) END)
 WHERE person_id IS NULL;

--- gate person on telegram

CREATE FUNCTION public.gate_open_set_person_on_telegram_id() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS
$$
BEGIN
    IF new.telegram_id THEN
        UPDATE public.gate_open
           SET person_id = new.id
         WHERE public.gate_open.source = new.telegram_id
           AND public.gate_open.person_id IS NULL;
    END IF;

    RETURN NULL;
END;
$$;

CREATE TRIGGER gate_open_set_person_on_telegram_id
    AFTER INSERT OR UPDATE OF telegram_id
    ON public.person
    FOR EACH ROW
EXECUTE PROCEDURE public.gate_open_set_person_on_telegram_id();

--- gate person on phone

CREATE FUNCTION public.gate_open_set_person_on_phone() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS
$$
BEGIN
    UPDATE public.gate_open
       SET person_id = new.person_id
     WHERE public.gate_open.source = new.phone
       AND public.gate_open.person_id IS NULL;

    RETURN NULL;
END;
$$;

CREATE TRIGGER gate_open_set_person_on_phone
    AFTER INSERT OR UPDATE OF phone
    ON public.person_phone
    FOR EACH ROW
EXECUTE PROCEDURE public.gate_open_set_person_on_phone();

--- gate person on email

CREATE FUNCTION public.gate_open_set_person_on_email() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS
$$
BEGIN
    UPDATE public.gate_open
       SET person_id = new.person_id
     WHERE public.gate_open.source = new.email
       AND public.gate_open.person_id IS NULL;

    RETURN NULL;
END;
$$;

CREATE TRIGGER gate_open_set_person_on_email
    AFTER INSERT OR UPDATE OF email
    ON public.person_email
    FOR EACH ROW
EXECUTE PROCEDURE public.gate_open_set_person_on_email();
