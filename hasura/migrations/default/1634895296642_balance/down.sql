
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE PROCEDURE person_balance(person_id_input uuid) AS
-- $$
-- BEGIN
--     UPDATE person
--     SET balance    = ( SELECT SUM(amount) FROM member_payment WHERE person_id = person_id_input ),
--         balance_at = NOW()
--     WHERE id = person_id_input;
-- END;
-- $$ LANGUAGE plpgsql;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."person" add column "balance_at" timestamptz
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."person" add column "balance" numeric
--  null;
