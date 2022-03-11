ALTER TABLE public.account ADD COLUMN end_at date NULL;

CREATE FUNCTION public.accrue_monthly_payments() RETURNS void AS
$$
INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at)
SELECT land.account_id, rate.amount * land.square * -1, land.id, rate.id, rate.amount, NOW()::date
  FROM member_rate rate
           CROSS JOIN (SELECT account.id AS account_id, al.land_id AS id, l.square
                         FROM account
                                  JOIN account_land al
                                  ON al.account_id = account.id
                                  JOIN land l
                                  ON al.land_id = l.id
                        WHERE account.end_at IS NULL) land
 WHERE since <= NOW()::date
   AND until >= NOW()::date ;
$$ LANGUAGE sql;
