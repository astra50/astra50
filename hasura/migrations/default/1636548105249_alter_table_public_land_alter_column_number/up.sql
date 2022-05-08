ALTER TABLE public.person ADD COLUMN phone_second text NULL;

ALTER TABLE public.person ADD COLUMN email text NULL;

ALTER TABLE public.member_payment ADD COLUMN is_regular boolean NOT NULL DEFAULT 'False';
ALTER TABLE land ALTER square TYPE numeric(10, 2) USING square::numeric(10, 2) / 100;

COMMENT ON COLUMN public.member_payment.is_regular IS E'Флаг автоматического начисления взносов';
