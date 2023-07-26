CREATE TABLE public.cctv
    (
        id uuid DEFAULT gen_random_uuid()
            PRIMARY KEY,
        name text NOT NULL,
        comment text,
        url text
    );
SELECT public.timestampable('public.cctv');
SELECT audit.audit_table('public.cctv');

ALTER TABLE public.gate ADD COLUMN cctv_id uuid REFERENCES public.cctv (id) ON UPDATE CASCADE ON DELETE SET NULL;
