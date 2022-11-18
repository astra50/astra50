ALTER TABLE public.target_payment DROP COLUMN contractor_id;

ALTER TABLE public.target_payment ALTER COLUMN person_id SET NOT NULL;

ALTER TABLE public.target_payment DROP CONSTRAINT person_or_contractor_required;

ALTER TABLE public.target_payment DROP CONSTRAINT person_and_contractor_must_not_be_both;

ALTER TABLE public.target DROP COLUMN increment_amount;
ALTER TABLE public.target DROP COLUMN decrement_amount;

CREATE OR REPLACE FUNCTION set_target_amount(uuid) RETURNS void
    LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE public.target
       SET current_amount = (SELECT SUM(amount) FROM target_payment WHERE target_id = $1)
     WHERE id = $1;
END;
$$;
