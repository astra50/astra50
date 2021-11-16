# СНТ Астра - CRM

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Generate payments for all defined rates
```sql
INSERT INTO member_payment (person_id, amount, land_id, rate_id, rate, paid_at)
SELECT land.person_id,
       rate.amount * land.square / 100,
       land.id,
       rate.id,
       rate.amount,
       GENERATE_SERIES(rate.since::timestamp, rate.until::timestamp - INTERVAL '1 day', '1 month'::interval)::date date
FROM member_rate rate
         CROSS JOIN ( SELECT person.id AS person_id, lo.land_id AS id, l.square
                      FROM person
                               JOIN land_ownership lo ON person.id = lo.owner_id
                               JOIN land l ON lo.land_id = l.id ) land
```
