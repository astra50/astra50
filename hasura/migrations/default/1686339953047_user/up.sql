CREATE TABLE public.users
    (
        id uuid NOT NULL
            PRIMARY KEY,
        username text NOT NULL
            UNIQUE
    );
SELECT public.timestampable('public.users');

ALTER TABLE public.person ADD COLUMN user_id uuid UNIQUE REFERENCES public.users (id) ON UPDATE CASCADE ON DELETE SET NULL;
