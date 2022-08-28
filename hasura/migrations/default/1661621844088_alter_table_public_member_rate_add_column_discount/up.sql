ALTER TABLE public.member_rate ADD COLUMN discount integer NOT NULL DEFAULT 0;

CREATE TABLE public.member_discount
    (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        account_id uuid NOT NULL,
        rate_id uuid NOT NULL,
        comment text,
        PRIMARY KEY (id),
        FOREIGN KEY (account_id) REFERENCES public.account (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
        FOREIGN KEY (rate_id) REFERENCES public.member_rate (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
        UNIQUE (account_id, rate_id)
    );

SELECT public.timestampable('public.member_discount');
SELECT audit.audit_table('public.member_discount');

ALTER TABLE public.member_payment ADD COLUMN is_discount bool DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.accrue_monthly_payments(on_date date) RETURNS void AS
$$
DECLARE
    rate record;
BEGIN
    SELECT * INTO rate FROM member_rate WHERE since <= on_date AND until >= on_date LIMIT 1;

    INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at, is_discount)
    SELECT discount.account_id, (rate.amount * land.square) * (rate.discount::numeric(4, 2) / 100), land.id, rate.id,
           rate.discount, NOW(), TRUE
      FROM member_discount discount
               JOIN account_land al
               ON al.account_id = discount.account_id
               JOIN land
               ON al.land_id = land.id
     WHERE rate.discount > 0
       AND discount.rate_id = rate.id;

    INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at)
    SELECT account.id, rate.amount * land.square * -1, land.id, rate.id, rate.amount, NOW()
      FROM account
               JOIN account_land al
               ON al.account_id = account.id
               JOIN land
               ON al.land_id = land.id
     WHERE account.end_at IS NULL;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION public.accrue_monthly_payments();

CREATE OR REPLACE FUNCTION public.set_person_last_payment(uuid) RETURNS void AS
$$
DECLARE
    payment record;
BEGIN
    SELECT INTO payment amount, paid_at
      FROM account_person
               JOIN member_payment mp
               ON account_person.account_id = mp.account_id AND mp.amount > 0 AND mp.is_discount IS FALSE
     WHERE account_person.person_id = $1
     ORDER BY mp.paid_at DESC
     LIMIT 1;

    UPDATE person SET last_paid_amount = payment.amount, last_paid_at = payment.paid_at WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
