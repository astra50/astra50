ALTER TABLE public.person
    ADD phone text;

--- Email

ALTER TABLE public.person
    ADD email text;

CREATE FUNCTION public.set_person_email() RETURNS trigger
    LANGUAGE plpgsql AS
$$
BEGIN
    new.email = LOWER(new.email);

    RETURN new;
END;
$$;

CREATE TRIGGER set_person_email
    BEFORE INSERT OR UPDATE OF email
    ON public.person
    FOR EACH ROW
EXECUTE PROCEDURE public.set_person_email();

