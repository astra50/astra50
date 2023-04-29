ALTER TABLE public.person DROP COLUMN full_name;
ALTER TABLE public.person
    ADD full_name text GENERATED ALWAYS AS (((((lastname || ' '::text) || firstname) || ' '::text) || middlename)) STORED;
