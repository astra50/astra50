SELECT audit.audit_table_drop('public.gate');
SELECT audit.audit_table_drop('public.gate_open');
SELECT audit.audit_table_drop('public.gate_open_reason');

DROP FUNCTION audit.audit_table_drop(regclass);

SELECT public.timestampable_drop('gate');
SELECT public.timestampable_drop('gate_open_reason');

ALTER TABLE public.gate_open DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.gate_open;

ALTER TABLE public.land DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.land;

ALTER TABLE public.land_ownership DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.land_ownership;

ALTER TABLE public.member_payment DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.member_payment;

ALTER TABLE public.member_rate DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.member_rate;

ALTER TABLE public.person DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.person;

ALTER TABLE public.street DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.street;

ALTER TABLE public.target DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.target;

ALTER TABLE public.target_payment DROP COLUMN updated_at;
DROP TRIGGER set_updated_at ON public.target_payment;

DROP FUNCTION public.set_current_timestamp_updated_at();
DROP FUNCTION public.timestampable(target_table regclass);
DROP FUNCTION public.timestampable_drop(target_table regclass);
