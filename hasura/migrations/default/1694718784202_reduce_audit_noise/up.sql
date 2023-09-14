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

    UPDATE person
       SET last_paid_amount = payment.amount,
           last_paid_at = payment.paid_at
     WHERE id = $1
       AND last_paid_amount <> payment.amount
       AND last_paid_at <> payment.paid_at;
END;
$$ LANGUAGE plpgsql;
