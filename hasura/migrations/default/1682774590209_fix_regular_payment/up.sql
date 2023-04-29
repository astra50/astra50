CREATE OR REPLACE FUNCTION public.accrue_monthly_payments(on_date date) RETURNS void
    LANGUAGE plpgsql AS
$$
DECLARE
    rate record;
BEGIN
    SELECT * INTO rate FROM member_rate WHERE since <= on_date AND until >= on_date LIMIT 1;

    INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at, is_discount, is_regular)
    SELECT discount.account_id,
           (rate.amount * land.square) * (rate.discount::numeric(4, 2) / 100),
           land.id,
           rate.id,
           rate.discount,
           NOW(),
           TRUE,
           TRUE
      FROM member_discount discount
               JOIN account_land al
               ON al.account_id = discount.account_id
               JOIN land
               ON al.land_id = land.id
     WHERE rate.discount > 0
       AND discount.rate_id = rate.id;

    INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at, is_regular)
    SELECT account.id,
           rate.amount * land.square * -1,
           land.id,
           rate.id,
           rate.amount,
           NOW(),
           TRUE
      FROM account
               JOIN account_land al
               ON al.account_id = account.id
               JOIN land
               ON al.land_id = land.id
     WHERE account.end_at IS NULL;
END;
$$;

UPDATE member_payment
   SET is_regular = TRUE
 WHERE TO_CHAR(paid_at, 'DD') = '01'
   AND is_regular = FALSE
   AND amount < 0
   AND land_id IS NOT NULL
   AND rate_id IS NOT NULL;
