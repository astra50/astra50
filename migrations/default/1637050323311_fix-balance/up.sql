DROP TRIGGER app_member_payment_balance_calculate_trigger ON member_payment;
DROP FUNCTION app_member_payment_balance_calculate;
DROP PROCEDURE app_person_balance_calculate(uuid);

CREATE PROCEDURE public.app_person_balance_calculate(uuid) AS
$$
BEGIN
    UPDATE public.person
       SET balance    = ( SELECT SUM(amount) FROM public.member_payment WHERE person_id = $1 ),
           balance_at = NOW()
     WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.app_member_payment_balance_calculate() RETURNS trigger AS
$$
BEGIN
    IF new.person_id IS NULL OR new.person_id <> old.person_id THEN CALL public.app_person_balance_calculate(old.person_id); END IF;

    IF new.person_id IS NOT NULL THEN CALL public.app_person_balance_calculate(new.person_id); END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_member_payment_balance_calculate_trigger
    AFTER INSERT OR DELETE OR UPDATE OF amount,person_id
    ON public.member_payment
    FOR EACH ROW
EXECUTE PROCEDURE public.app_member_payment_balance_calculate();
