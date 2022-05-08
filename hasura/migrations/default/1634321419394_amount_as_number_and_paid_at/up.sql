CREATE TABLE "public"."member_payment"
(
    "id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "person_id"  uuid        NOT NULL,
    "amount"     bigint      NOT NULL,
    "comment"    text,
    "land_id"    uuid,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("land_id") REFERENCES "public"."land" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT,
    FOREIGN KEY ("person_id") REFERENCES "public"."person" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."target_payment"
(
    "id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "person_id"  uuid        NOT NULL,
    "land_id"    uuid,
    "comment"    text,
    "amount"     bigint      NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("land_id") REFERENCES "public"."land" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT,
    FOREIGN KEY ("person_id") REFERENCES "public"."person" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "public"."target_payment"
    RENAME TO "payment_target";

ALTER TABLE "public"."member_payment"
    RENAME TO "payment_member";

COMMENT ON TABLE "public"."payment_member" IS E'Членские взносы';

COMMENT ON TABLE "public"."payment_target" IS E'Целевые взносы';

ALTER TABLE "public"."payment_member"
    RENAME TO "member_payment";

ALTER TABLE "public"."payment_target"
    RENAME TO "target_payment";

CREATE TABLE "public"."member_payment_rate"
(
    "id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "amount"     integer     NOT NULL,
    "since"      date        NOT NULL,
    "until"      date        NOT NULL,
    "comment"    text,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."member_payment_rate" IS E'Ставка членских взносов';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "public"."member_payment"
    ADD COLUMN "rate_id" uuid NULL;

ALTER TABLE "public"."member_payment"
    ADD COLUMN "rate" integer NULL;

ALTER TABLE "public"."member_payment"
    ADD CONSTRAINT "member_payment_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "public"."member_payment_rate" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE "public"."member_payment_rate"
    RENAME TO "member_rate";

CREATE TABLE "public"."target"
(
    "id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "name"       text        NOT NULL,
    "comment"    text,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."target" IS E'Статьи целевых взносов';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "public"."target_payment"
    ADD COLUMN "target_id" uuid NOT NULL;

ALTER TABLE "public"."target_payment"
    ADD CONSTRAINT "target_payment_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "public"."target" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

COMMENT ON TABLE "public"."street" IS E'Улицы';

COMMENT ON TABLE "public"."person" IS E'Члены СНТ';

DROP TABLE "public"."payment";

COMMENT ON TABLE "public"."land_ownership" IS E'Владельцы участков';

COMMENT ON TABLE "public"."land" IS E'Земельные участки';


ALTER TABLE "public"."member_payment"
    ADD COLUMN "paid_at" date NOT NULL;

ALTER TABLE "public"."member_payment"
    ALTER COLUMN "amount" TYPE money;

ALTER TABLE "public"."member_payment"
    ALTER COLUMN "amount" TYPE numeric(10, 2);

ALTER TABLE "public"."target_payment"
    ADD COLUMN "paid_at" date NOT NULL;
