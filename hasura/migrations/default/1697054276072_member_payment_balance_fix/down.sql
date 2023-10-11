CREATE OR REPLACE FUNCTION public.calculate_member_payment_balance_by_account_id(_id uuid) RETURNS void AS
$$
UPDATE member_payment
   SET balance = sub.balance
  FROM (SELECT id,
               (SELECT SUM(sub.amount)
                  FROM member_payment sub
                 WHERE sub.account_id = mp.account_id AND sub.paid_at <= mp.paid_at) AS balance
          FROM member_payment mp
         WHERE account_id = _id) sub
 WHERE member_payment.id = sub.id
   AND member_payment.balance <> sub.balance;
$$ LANGUAGE sql;
