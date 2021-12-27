CREATE OR REPLACE FUNCTION public.set_person_last_payment(uuid) RETURNS void AS
$$
DECLARE
    payment record;
BEGIN
    SELECT INTO payment amount, paid_at
      FROM account_person
               JOIN member_payment mp
               ON account_person.account_id = mp.account_id AND mp.amount > 0
     WHERE account_person.person_id = $1
     ORDER BY mp.paid_at DESC
     LIMIT 1;

    UPDATE person SET last_paid_amount = payment.amount, last_paid_at = payment.paid_at WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

SELECT public.set_person_last_payment(id)
  FROM person;
