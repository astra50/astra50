ALTER TABLE person
    ADD COLUMN passport_serial varchar(10),
    ADD COLUMN passport_number varchar(10),
    ADD COLUMN passport_issued_by varchar(100),
    ADD COLUMN passport_issued_date date,
    ADD COLUMN passport_issued_code varchar(7),
    ADD COLUMN registration_address varchar(200);
