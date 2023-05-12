DROP TRIGGER gate_open_set_person_on_telegram_id ON public.person;
CREATE OR REPLACE FUNCTION public.gate_open_set_person_on_telegram_id() RETURNS trigger
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

---

DROP TRIGGER gate_open_set_person_on_phone ON public.person_phone;
CREATE OR REPLACE FUNCTION public.gate_open_set_person_on_phone() RETURNS trigger
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

---

DROP TRIGGER gate_open_set_person_on_email ON public.person_email;
CREATE OR REPLACE FUNCTION public.gate_open_set_person_on_email() RETURNS trigger
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
