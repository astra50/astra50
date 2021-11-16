ALTER TABLE public.person
    ADD COLUMN "balance" numeric(10, 2) DEFAULT 0;

ALTER TABLE public.person
    ADD COLUMN "balance_at" timestamptz DEFAULT NOW();

CREATE OR REPLACE PROCEDURE app_person_balance_calculate(uuid) AS
$$
BEGIN
    UPDATE person
    SET balance    = ( SELECT SUM(amount) FROM member_payment WHERE person_id = $1 ),
        balance_at = NOW()
    WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION app_member_payment_balance_calculate() RETURNS trigger AS
$$
BEGIN
    IF new.person_id IS NULL OR new.person_id <> old.person_id THEN CALL app_person_balance_calculate(old.person_id); END IF;

    IF new.person_id IS NOT NULL THEN CALL app_person_balance_calculate(new.person_id); END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS app_member_payment_balance_calculate_trigger ON member_payment;
CREATE TRIGGER app_member_payment_balance_calculate_trigger
    AFTER INSERT OR DELETE OR UPDATE OF amount,person_id
    ON member_payment
    FOR EACH ROW
EXECUTE PROCEDURE app_member_payment_balance_calculate();
