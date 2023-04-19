--- Add balance column to member_payment
ALTER TABLE member_payment ADD COLUMN balance numeric(10, 2);

CREATE FUNCTION calculate_member_payment_balance_by_account_id(_id uuid) RETURNS void AS
$$
UPDATE member_payment
   SET balance = sub.balance
  FROM (SELECT id,
               (SELECT SUM(sub.amount)
                  FROM member_payment sub
                 WHERE sub.account_id = mp.account_id AND sub.paid_at <= mp.paid_at) AS balance
          FROM member_payment mp
         WHERE account_id = _id) sub
 WHERE member_payment.id = sub.id;
$$ LANGUAGE sql;

SELECT calculate_member_payment_balance_by_account_id(sub.account_id)
  FROM (SELECT DISTINCT account_id FROM member_payment) sub;

CREATE FUNCTION calculate_member_payment_balance() RETURNS trigger AS
$$
BEGIN
    SELECT calculate_member_payment_balance_by_account_id(new.account_id);

    IF (old.account_id <> new.account_id) THEN
        SELECT calculate_member_payment_balance_by_account_id(old.account_id);
    END IF;
END ;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance
    AFTER INSERT OR UPDATE OF amount,account_id
    ON member_payment
EXECUTE PROCEDURE calculate_member_payment_balance();
