CREATE OR REPLACE FUNCTION calculate_member_payment_balance() RETURNS trigger AS
$$
BEGIN
    SELECT calculate_member_payment_balance_by_account_id(new.account_id);

    IF (old.account_id <> new.account_id) THEN
        SELECT calculate_member_payment_balance_by_account_id(old.account_id);
    END IF;
END ;
$$ LANGUAGE plpgsql;

DROP TRIGGER update_balance ON member_payment;
CREATE TRIGGER update_balance
    AFTER INSERT OR UPDATE OF amount,account_id
    ON member_payment
EXECUTE PROCEDURE calculate_member_payment_balance();
