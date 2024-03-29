CREATE TABLE refinance_rate
    (
        id uuid NOT NULL DEFAULT gen_random_uuid()
            PRIMARY KEY,
        rate numeric(4, 2) NOT NULL,
        since date NOT NULL,
        UNIQUE (rate, since)
    )
;
SELECT audit.audit_table('public.refinance_rate');
SELECT public.timestampable('public.refinance_rate');

INSERT INTO refinance_rate (rate, since)
VALUES (7.50, '2022-09-19'),
       (8.00, '2022-07-25'),
       (9.50, '2022-06-14'),
       (11.00, '2022-05-27'),
       (14.00, '2022-05-04'),
       (17.00, '2022-04-11'),
       (20.00, '2022-02-28'),
       (9.50, '2022-02-14'),
       (8.50, '2021-12-20'),
       (7.50, '2021-10-25'),
       (6.75, '2021-09-13'),
       (6.50, '2021-07-26'),
       (5.50, '2021-06-15'),
       (5.00, '2021-04-26'),
       (4.50, '2021-03-22'),
       (4.25, '2020-07-27'),
       (4.50, '2020-06-22'),
       (5.50, '2020-04-27'),
       (6.00, '2020-02-10'),
       (6.25, '2020-01-03');
