ALTER TABLE public.target_payment ADD COLUMN contractor_id uuid DEFAULT NULL
    REFERENCES contractor (id);

ALTER TABLE public.target_payment ALTER COLUMN person_id DROP NOT NULL;

ALTER TABLE public.target_payment ADD CONSTRAINT person_or_contractor_required
    CHECK ( person_id IS NOT NULL OR contractor_id IS NOT NULL);

ALTER TABLE public.target_payment ADD CONSTRAINT person_and_contractor_must_not_be_both
    CHECK ( NOT (person_id IS NOT NULL AND contractor_id IS NOT NULL) );

ALTER TABLE public.target ADD COLUMN increment_amount numeric(10, 2) DEFAULT 0 NOT NULL ;
ALTER TABLE public.target ADD COLUMN decrement_amount numeric(10, 2) DEFAULT 0 NOT NULL ;

CREATE OR REPLACE FUNCTION set_target_amount(uuid) RETURNS void
    LANGUAGE plpgsql AS
$$
BEGIN
    UPDATE public.target
       SET current_amount = coalesce((SELECT SUM(amount) FROM target_payment WHERE target_id = $1), 0),
           increment_amount = COALESCE((SELECT SUM(amount) FROM target_payment WHERE target_id = $1 AND amount > 0), 0),
           decrement_amount = COALESCE((SELECT SUM(amount) FROM target_payment WHERE target_id = $1 AND amount < 0), 0)
     WHERE id = $1;
END;
$$;

SELECT public.set_target_amount(target_id) FROM target_payment;
