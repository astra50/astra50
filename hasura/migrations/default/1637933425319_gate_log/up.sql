CREATE TABLE public.gate
    (
        id uuid DEFAULT gen_random_uuid() NOT NULL
            CONSTRAINT gate_pkey
                PRIMARY KEY,
        name text NOT NULL,
        phone text DEFAULT NULL
    );

CREATE TABLE public.gate_open_reason
    (
        id text NOT NULL
            CONSTRAINT gate_open_reason_pkey
                PRIMARY KEY,
        name text NOT NULL
    );

INSERT INTO public.gate_open_reason(id, name)
VALUES ('telephone', 'Звонок по телефону');

CREATE TABLE public.gate_open
    (
        id uuid DEFAULT gen_random_uuid() NOT NULL
            CONSTRAINT gate_open_log_pkey
                PRIMARY KEY,
        gate_id uuid NOT NULL
            REFERENCES gate (id),
        reason_id text NOT NULL
            REFERENCES gate_open_reason (id),
        source text NOT NULL,
        comment text DEFAULT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW()
    );
