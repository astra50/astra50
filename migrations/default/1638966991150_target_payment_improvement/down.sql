DROP TRIGGER set_target_amount ON public.target_payment;
DROP FUNCTION public.set_target_amount();
DROP FUNCTION public.set_target_amount(uuid);

ALTER TABLE public.target DROP initial_amount;
ALTER TABLE public.target DROP total_amount;
ALTER TABLE public.target DROP payer_amount;
ALTER TABLE public.target DROP current_amount;
