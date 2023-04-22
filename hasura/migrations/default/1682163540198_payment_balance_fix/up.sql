CREATE OR REPLACE FUNCTION calculate_member_payment_balance() RETURNS trigger AS
$$
BEGIN
    PERFORM calculate_member_payment_balance_by_account_id(new.account_id);

    IF (old.account_id <> new.account_id) THEN
        PERFORM calculate_member_payment_balance_by_account_id(old.account_id);
    END IF;

    RETURN NULL;
END ;
$$ LANGUAGE plpgsql;

DROP TRIGGER update_balance ON member_payment;
CREATE TRIGGER update_balance
    AFTER INSERT OR UPDATE OF amount,account_id,paid_at
    ON member_payment
    FOR EACH ROW
EXECUTE PROCEDURE calculate_member_payment_balance();

SELECT calculate_member_payment_balance_by_account_id(sub.account_id)
  FROM (SELECT DISTINCT account_id FROM member_payment) sub;
