alter table "public"."member_payment" add column "is_regular" boolean
 not null default 'False';
ALTER TABLE land ALTER square TYPE numeric(10, 2) USING square::numeric(10, 2) / 100;
