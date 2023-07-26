CREATE TABLE public.contact
    (
        id uuid NOT NULL DEFAULT gen_random_uuid()
            PRIMARY KEY,
        name text NOT NULL,
        description text,
        comment text,
        phone phone_number,
        site text,
        is_public boolean DEFAULT FALSE,
        position integer
    )
;
SELECT public.timestampable('public.contact');
SELECT audit.audit_table('public.contact');
