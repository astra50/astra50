ALTER TABLE public.account DROP COLUMN end_at;

DROP FUNCTION public.accrue_monthly_payments();
