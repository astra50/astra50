CREATE FUNCTION public.set_person_email() RETURNS trigger AS
$$
BEGIN
    new.email = LOWER(new.email);

    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_person_email
    BEFORE INSERT OR UPDATE OF email
    ON public.person
    FOR EACH ROW
EXECUTE PROCEDURE public.set_person_email();

UPDATE public.person
   SET email = LOWER(email);
