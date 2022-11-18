ALTER TABLE public.target_payment DROP CONSTRAINT zero_amount_not_allowed;

ALTER TABLE public.member_payment DROP CONSTRAINT zero_amount_not_allowed;
