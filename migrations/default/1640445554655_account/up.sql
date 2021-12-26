DROP TRIGGER app_member_payment_balance_calculate_trigger ON member_payment;
DROP FUNCTION app_member_payment_balance_calculate;
DROP PROCEDURE app_person_balance_calculate(uuid);

CREATE TABLE public.account
    (
        id uuid NOT NULL DEFAULT gen_random_uuid()
            PRIMARY KEY,
        number text DEFAULT NULL,
        comment text DEFAULT NULL,
        person_id uuid
            REFERENCES person (id),
        balance numeric(10, 2),
        balance_at timestamptz DEFAULT NOW()
    );

CREATE TABLE public.account_land
    (
        id uuid NOT NULL DEFAULT gen_random_uuid()
            PRIMARY KEY,
        land_id uuid NOT NULL
            REFERENCES land (id),
        account_id uuid NOT NULL
            REFERENCES account (id) ON DELETE CASCADE
    );
CREATE UNIQUE INDEX account_land_unique_idx ON public.account_land (land_id, account_id);

CREATE TABLE public.account_person
    (
        id uuid NOT NULL DEFAULT gen_random_uuid()
            PRIMARY KEY,
        person_id uuid NOT NULL
            REFERENCES person (id) ON DELETE CASCADE,
        account_id uuid NOT NULL
            REFERENCES account (id) ON DELETE CASCADE
    );
CREATE UNIQUE INDEX account_person_unique_idx ON public.account_person (person_id, account_id);

SELECT public.timestampable('public.account');
SELECT public.timestampable('public.account_land');
SELECT public.timestampable('public.account_person');
SELECT audit.audit_table('public.account');
SELECT audit.audit_table('public.account_land');
SELECT audit.audit_table('public.account_person');

ALTER TABLE public.person ADD account_id uuid DEFAULT gen_random_uuid();

INSERT INTO public.account (id, person_id)
SELECT account_id, id
  FROM person;

INSERT INTO public.account_land (land_id, account_id)
SELECT land_id, p.account_id
  FROM land_ownership
           JOIN person p
           ON p.id = land_ownership.owner_id;

INSERT INTO public.account_person (person_id, account_id)
SELECT id, account_id
  FROM person;

UPDATE public.account
   SET number = (SELECT MIN(number)
                   FROM land
                            JOIN public.account_land al
                            ON land.id = al.land_id
                  WHERE al.account_id = account.id) || ':001';
DELETE
  FROM public.account
 WHERE number IS NULL;
ALTER TABLE public.account ALTER number SET NOT NULL;

ALTER TABLE public.member_payment ADD account_id uuid DEFAULT NULL
    REFERENCES account (id);

UPDATE public.member_payment
   SET account_id = p.account_id
  FROM person p
 WHERE member_payment.person_id = p.id;
ALTER TABLE public.member_payment ALTER account_id SET NOT NULL;
ALTER TABLE public.member_payment ALTER person_id SET DEFAULT NULL;
ALTER TABLE public.member_payment ALTER person_id DROP NOT NULL;

ALTER TABLE public.person DROP account_id;
DROP TABLE land_ownership;

---

CREATE FUNCTION public.set_account_balance(uuid) RETURNS void AS
$$
BEGIN
    UPDATE account
       SET balance = (SELECT COALESCE((SELECT SUM(amount) FROM member_payment WHERE account_id = $1), 0.00)),
           balance_at = NOW()
     WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.account_trigger_balance() RETURNS trigger AS
$$
BEGIN
    IF new.account_id IS NULL OR new.account_id <> old.account_id THEN
        PERFORM set_account_balance(old.account_id);
    END IF;

    IF new.account_id IS NOT NULL THEN PERFORM set_account_balance(new.account_id); END IF;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_account_balance
    AFTER INSERT OR DELETE OR UPDATE OF amount,account_id
    ON public.member_payment
    FOR EACH ROW
EXECUTE PROCEDURE account_trigger_balance();

---

CREATE FUNCTION public.set_person_balance(uuid) RETURNS void AS
$$
BEGIN
    UPDATE person
       SET balance = (SELECT COALESCE((SELECT SUM(balance)
                                         FROM account
                                                  JOIN account_person
                                                  ON account.id = account_person.account_id
                                        WHERE account_person.person_id = $1), 0.00)),
           balance_at = NOW()
     WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.person_balance_trigger_account() RETURNS trigger AS
$$
BEGIN
    PERFORM set_person_balance(person_id) FROM account_person WHERE account_id = new.id;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_person_balance
    AFTER UPDATE OF balance
    ON public.account
    FOR EACH ROW
EXECUTE PROCEDURE person_balance_trigger_account();

---

CREATE FUNCTION public.person_balance_trigger_account_person() RETURNS trigger AS
$$
BEGIN
    IF (tg_op = 'DELETE') THEN
        PERFORM set_account_balance(old.account_id);
        PERFORM set_person_balance(old.person_id);

        RETURN old;
    ELSIF (tg_op = 'UPDATE') THEN
        IF new.account_id <> old.account_id THEN PERFORM set_account_balance(old.account_id); END IF;
        IF new.person_id <> old.person_id THEN PERFORM set_person_balance(old.person_id); END IF;

        RETURN new;
    ELSIF (tg_op = 'INSERT') THEN
        PERFORM set_account_balance(new.account_id);
        PERFORM set_person_balance(new.person_id);

        RETURN new;
    END IF;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_person_balance
    AFTER INSERT OR DELETE OR UPDATE OF account_id,person_id
    ON public.account_person
    FOR EACH ROW
EXECUTE PROCEDURE person_balance_trigger_account_person();

---

SELECT public.set_account_balance(id)
  FROM account;

---

ALTER TABLE land ALTER COLUMN number TYPE text USING number::text;
ALTER TABLE land ADD COLUMN number_integer integer GENERATED ALWAYS AS ( number::integer ) STORED;

ALTER TABLE public.person ADD last_paid_amount numeric(10, 2);
ALTER TABLE public.person ADD last_paid_at date DEFAULT NULL;

---

CREATE FUNCTION public.set_person_last_payment(uuid) RETURNS void AS
$$
DECLARE
    payment record;
BEGIN
    SELECT INTO payment amount, paid_at
      FROM account_person
               JOIN member_payment mp
               ON account_person.account_id = mp.account_id
     WHERE account_person.person_id = $1
     ORDER BY mp.paid_at DESC
     LIMIT 1;

    UPDATE person SET last_paid_amount = payment.amount, last_paid_at = payment.paid_at WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

SELECT public.set_person_last_payment(id)
  FROM person;

CREATE FUNCTION public.person_last_paid_trigger_member_payment() RETURNS trigger AS
$$
BEGIN
    IF (tg_op = 'DELETE') THEN
        PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_person.account_id = old.account_id;

        RETURN old;
    ELSIF (tg_op = 'UPDATE') THEN
        IF new.account_id <> old.account_id THEN
            PERFORM set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = old.account_id;

            PERFORM set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = new.account_id;
        ELSEIF new.amount <> old.amount OR new.paid_at <> old.paid_at THEN
            PERFORM set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = new.account_id;
        END IF;

        RETURN new;
    ELSIF (tg_op = 'INSERT') THEN
        PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_person.account_id = new.account_id;

        RETURN new;
    END IF;

    PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_id = new.id;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_person_last_payment
    AFTER INSERT OR DELETE OR UPDATE OF account_id, amount, paid_at
    ON public.member_payment
    FOR EACH ROW
EXECUTE PROCEDURE person_last_paid_trigger_member_payment();

---

CREATE FUNCTION public.add_account_person_trigger_account() RETURNS trigger AS
$$
BEGIN
    IF (tg_op = 'UPDATE') THEN
        IF new.person_id <> old.person_id THEN
            DELETE FROM account_person WHERE person_id = old.person_id AND account_id = old.id;
            INSERT INTO account_person (person_id, account_id) VALUES (new.person_id, new.id);
        END IF;

        RETURN new;
    ELSIF (tg_op = 'INSERT') THEN
        INSERT INTO account_person (person_id, account_id) VALUES (new.person_id, new.id);

        RETURN new;
    END IF;

    PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_id = new.id;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_person_to_account
    AFTER INSERT OR UPDATE OF person_id
    ON public.account
    FOR EACH ROW
EXECUTE PROCEDURE add_account_person_trigger_account();

---

ALTER TABLE public.person ADD full_name text GENERATED ALWAYS AS ( lastname || ' ' || firstname || ' ' || middlename ) STORED;
