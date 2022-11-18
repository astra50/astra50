CREATE TABLE public.contractor
    (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        name text NOT NULL,
        comment text DEFAULT NULL,
        PRIMARY KEY (id)
    );
SELECT public.timestampable('public.contractor')
