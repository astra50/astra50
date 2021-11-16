
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."payment" add column "payment_at" date
--  not null;

ALTER TABLE "public"."street" ALTER COLUMN "id" drop default;

ALTER TABLE "public"."land" ALTER COLUMN "id" drop default;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."land_ownership" add column "created_at" timestamptz
--  not null default now();

DROP TABLE "public"."payment";

DROP TABLE "public"."land_owner";

DROP TABLE "public"."land_ownership";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."street" add column "created_at" timestamptz
--  null default now();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."person" add column "created_at" timestamptz
--  null default now();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."land" add column "created_at" timestamptz
--  null default now();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."land" add column "square" integer
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."land" add column "cadastral_number" text
--  null unique;

DROP TABLE "public"."person";

DROP TABLE "public"."land";

DROP TABLE "public"."street";
