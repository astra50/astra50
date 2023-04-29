--- https://dba.stackexchange.com/a/165923
CREATE DOMAIN email AS text CHECK ( value ~
                                    '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$' );

CREATE TABLE public.person_email
    (
        id uuid DEFAULT gen_random_uuid() NOT NULL
            PRIMARY KEY,
        email email NOT NULL
            UNIQUE,
        person_id uuid NOT NULL
            REFERENCES public.person (id),
        is_main bool DEFAULT FALSE NOT NULL,
        comment text
    );
SELECT public.timestampable('public.person_email');
SELECT audit.audit_table('public.person_email');
CREATE UNIQUE INDEX person_email_only_one_is_main ON public.person_email (person_id, is_main) WHERE (is_main IS TRUE);

CREATE INDEX ON public.person_email(person_id);

CREATE FUNCTION public.set_person_email_is_main_to_false() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS
$$
BEGIN
    IF new.is_main IS TRUE THEN
        UPDATE public.person_email SET is_main = FALSE WHERE person_id = new.person_id AND id <> new.id;
    END IF;

    RETURN new;
END;
$$;

CREATE TRIGGER set_person_email_is_main_to_false
    BEFORE INSERT OR UPDATE OF is_main
    ON public.person_email
    FOR EACH ROW
EXECUTE PROCEDURE public.set_person_email_is_main_to_false();

--- Migrate email

UPDATE public.person
   SET email = NULL
 WHERE TRIM(email) = '';
UPDATE public.person
   SET email = TRIM(TRIM(email), CHR(160))
 WHERE email IS NOT NULL;

INSERT INTO public.person_email (email, person_id, is_main)
SELECT TRIM(email)::email, id, TRUE
  FROM public.person
 WHERE email IS NOT NULL
   AND TRIM(email) <> ''
    ON CONFLICT DO NOTHING;
