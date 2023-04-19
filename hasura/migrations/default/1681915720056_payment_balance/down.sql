DROP TRIGGER update_balance ON member_payment;
DROP FUNCTION calculate_member_payment_balance();
DROP FUNCTION calculate_member_payment_balance_by_account_id(_id uuid);

ALTER TABLE member_payment DROP COLUMN balance;
