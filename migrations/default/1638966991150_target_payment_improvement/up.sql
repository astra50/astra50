ALTER TABLE public.target ADD COLUMN initial_amount numeric(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE public.target ADD COLUMN total_amount numeric(10, 2) NOT NULL DEFAULT 0;
COMMENT ON COLUMN public.target.total_amount IS E'Целевая сумма';
ALTER TABLE public.target ADD COLUMN payer_amount numeric(10, 2) NULL;
ALTER TABLE public.target ADD COLUMN current_amount numeric(10, 2) NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.set_target_amount(uuid) RETURNS void AS
$$
BEGIN
    UPDATE public.target
       SET current_amount = (SELECT SUM(amount) FROM target_payment WHERE target_id = $1)
     WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_target_amount() RETURNS trigger AS
$$
BEGIN
    IF new.target_id <> old.target_id THEN PERFORM public.set_target_amount(old.target_id); END IF;

    PERFORM public.set_target_amount(new.target_id);

    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_target_amount
    AFTER INSERT OR UPDATE OF amount, target_id
    ON public.target_payment
    FOR EACH ROW
EXECUTE PROCEDURE public.set_target_amount();

SELECT public.set_target_amount(id)
  FROM target;
