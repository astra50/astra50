CREATE DOMAIN public.phone_number AS text CHECK ( value ~ '^\+[0-9]+$' );

--- Fix old phones

UPDATE public.person
   SET phone = NULL
 WHERE phone IS NOT NULL
   AND TRIM(phone) = '';
UPDATE public.person
   SET phone_second = NULL
 WHERE phone_second IS NOT NULL
   AND TRIM(phone_second) = '';

UPDATE public.person
   SET phone = TRIM(phone)
 WHERE phone IS NOT NULL;
UPDATE public.person
   SET phone_second = TRIM(phone_second)
 WHERE phone_second IS NOT NULL;

UPDATE public.person
   SET phone = '+' || person.phone
 WHERE LEFT(phone, 1) = '7';
UPDATE public.person
   SET phone_second = '+' || person.phone_second
 WHERE LEFT(phone_second, 1) = '7';

UPDATE public.person
   SET phone = '+7' || SUBSTR(person.phone, 2)
 WHERE LEFT(phone, 1) = '8';
UPDATE public.person
   SET phone_second = '+7' || SUBSTR(person.phone_second, 2)
 WHERE LEFT(phone_second, 1) = '8';

--- New table

CREATE TABLE public.person_phone
    (
        id uuid DEFAULT gen_random_uuid() NOT NULL
            PRIMARY KEY,
        phone phone_number NOT NULL
            UNIQUE,
        person_id uuid NOT NULL
            REFERENCES public.person (id),
        is_main bool DEFAULT FALSE NOT NULL,
        comment text
    );
SELECT public.timestampable('public.person_phone');
SELECT audit.audit_table('public.person_phone');
CREATE UNIQUE INDEX person_phone_only_one_main ON public.person_phone (person_id, is_main) WHERE (is_main IS TRUE);

CREATE INDEX ON public.person_phone(person_id);

--- Migrate data

INSERT INTO public.person_phone (phone, person_id, is_main)
SELECT phone::phone_number, id AS person_id, TRUE
  FROM public.person
 WHERE phone IS NOT NULL;

INSERT INTO public.person_phone (phone, person_id)
SELECT phone_second::phone_number, id AS person_id
  FROM public.person
 WHERE phone_second IS NOT NULL
;

--- Drop second phone

ALTER TABLE public.person DROP COLUMN phone_second;

--- Unique main

CREATE FUNCTION public.set_person_phone_is_main_to_false() RETURNS trigger
    LANGUAGE plpgsql
    VOLATILE AS
$$
BEGIN
    IF new.is_main IS TRUE THEN
        UPDATE public.person_phone SET is_main = FALSE WHERE person_id = new.person_id AND id <> new.id;
    END IF;

    RETURN new;
END;
$$;

CREATE TRIGGER set_person_phone_is_main_to_false
    BEFORE INSERT OR UPDATE OF is_main
    ON public.person_phone
    FOR EACH ROW
EXECUTE PROCEDURE public.set_person_phone_is_main_to_false();
