ALTER TABLE public.person DROP COLUMN full_name;
ALTER TABLE public.person
    ADD full_name text GENERATED ALWAYS AS (TRIM(COALESCE(lastname, '') || ' ' || COALESCE(firstname, '') || ' ' ||
                                                 COALESCE(middlename, ''))) STORED;
