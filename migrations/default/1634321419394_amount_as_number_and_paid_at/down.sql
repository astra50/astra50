

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."target_payment" add column "paid_at" date
--  not null;

ALTER TABLE "public"."member_payment" ALTER COLUMN "amount" TYPE money;

ALTER TABLE "public"."member_payment" ALTER COLUMN "amount" TYPE bigint;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."member_payment" add column "paid_at" date
--  not null;

COMMENT ON TABLE "public"."land" IS E'NULL';

COMMENT ON TABLE "public"."land_ownership" IS E'NULL';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."payment";

COMMENT ON TABLE "public"."person" IS E'NULL';

COMMENT ON TABLE "public"."street" IS E'NULL';

ALTER TABLE "public"."target_payment"
    DROP CONSTRAINT "target_payment_target_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."target_payment" add column "target_id" uuid
--  not null;

DROP TABLE "public"."target";

ALTER TABLE "public"."member_rate"
    RENAME TO "member_payment_rate";

ALTER TABLE "public"."member_payment"
    DROP CONSTRAINT "member_payment_rate_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."member_payment" add column "rate" integer
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."member_payment" add column "rate_id" uuid
--  null;

DROP TABLE "public"."member_payment_rate";

ALTER TABLE "public"."target_payment"
    RENAME TO "payment_target";

ALTER TABLE "public"."member_payment"
    RENAME TO "payment_member";

COMMENT ON TABLE "public"."payment_target" IS E'NULL';

COMMENT ON TABLE "public"."payment_member" IS E'NULL';

ALTER TABLE "public"."payment_member"
    RENAME TO "member_payment";

ALTER TABLE "public"."payment_target"
    RENAME TO "target_payment";

DROP TABLE "public"."target_payment";

DROP TABLE "public"."member_payment";
