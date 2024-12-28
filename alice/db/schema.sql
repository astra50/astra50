--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET
statement_timeout = 0;
SET
lock_timeout = 0;
SET
idle_in_transaction_session_timeout = 0;
SET
client_encoding = 'UTF8';
SET
standard_conforming_strings = ON;
SELECT pg_catalog.set_config('search_path', '', FALSE);
SET
check_function_bodies = FALSE;
SET
xmloption = content;
SET
client_min_messages = warning;
SET
row_security = off;

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: astra50
--

CREATE SCHEMA audit;


ALTER
SCHEMA audit OWNER TO astra50;

--
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: astra50
--

COMMENT
ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: astra50
--

CREATE SCHEMA hdb_catalog;


ALTER
SCHEMA hdb_catalog OWNER TO astra50;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE
EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA PUBLIC;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT
ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: email; Type: DOMAIN; Schema: public; Owner: astra50
--

CREATE DOMAIN public.email AS text
    CONSTRAINT email_check CHECK ((VALUE ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$'::text));


ALTER DOMAIN public.email OWNER TO astra50;

--
-- Name: phone_number; Type: DOMAIN; Schema: public; Owner: astra50
--

CREATE DOMAIN public.phone_number AS text
    CONSTRAINT phone_number_check CHECK ((VALUE ~ '^\+[0-9]+$'::text));


ALTER DOMAIN public.phone_number OWNER TO astra50;

--
-- Name: audit_table(regclass); Type: FUNCTION; Schema: audit; Owner: astra50
--

CREATE FUNCTION audit.audit_table(target_table regclass) RETURNS void
    LANGUAGE SQL AS $_$
SELECT audit.audit_table($1, boolean 't', boolean 't');
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass) OWNER TO astra50;

--
-- Name: FUNCTION audit_table(target_table regclass); Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON FUNCTION audit.audit_table(target_table regclass) IS '
Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
';


--
-- Name: audit_table(regclass, boolean, boolean); Type: FUNCTION; Schema: audit; Owner: astra50
--

CREATE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void
    LANGUAGE SQL AS $_$
SELECT audit.audit_table($1, $2, $3, array[]::text[]);
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) OWNER TO astra50;

--
-- Name: audit_table(regclass, boolean, boolean, text[]); Type: FUNCTION; Schema: audit; Owner: astra50
--

CREATE FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean,
                                  ignored_cols text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
    _q_txt text;
    _ignored_cols_snip text
= '';
BEGIN
EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;

IF
audit_rows THEN
        IF array_length(ignored_cols,1) > 0 THEN
            _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
END IF;
        _q_txt
= 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' ||
                 target_table ||
                 ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
                 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
        RAISE
NOTICE '%',_q_txt;
EXECUTE _q_txt;
stm_targets
= 'TRUNCATE';
ELSE
END IF;

    _q_txt
= 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
             target_table ||
             ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
             quote_literal(audit_query_text) || ');';
    RAISE
NOTICE '%',_q_txt;
EXECUTE _q_txt;

END;
$$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) OWNER TO astra50;

--
-- Name: FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]); Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) IS '
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
';


--
-- Name: audit_table_drop(regclass); Type: FUNCTION; Schema: audit; Owner: astra50
--

CREATE FUNCTION audit.audit_table_drop(target_table regclass) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;
END;
$$;


ALTER FUNCTION audit.audit_table_drop(target_table regclass) OWNER TO astra50;

--
-- Name: if_modified_func(); Type: FUNCTION; Schema: audit; Owner: astra50
--

CREATE FUNCTION audit.if_modified_func() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public'
    AS $$
DECLARE
hasura        jsonb;
    audit_row
audit.logged_actions;
    excluded_cols
text[] = ARRAY []::text[];
    new_r
jsonb;
    old_r
jsonb;
BEGIN
    IF
tg_when <> 'AFTER' THEN RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
END IF;

    hasura
:= CURRENT_SETTING('hasura.user', 't')::jsonb;

    audit_row
= ROW (NEXTVAL('audit.logged_actions_event_id_seq'), -- event_id
        tg_table_schema::text, -- schema_name
        tg_table_name::text, -- table_name
        tg_relid, -- relation OID for much quicker searches
        SESSION_USER::text, -- session_user_name
        hasura, -- user information from hasura graphql engine
        CURRENT_TIMESTAMP, -- action_tstamp_tx
        STATEMENT_TIMESTAMP(), -- action_tstamp_stm
        CLOCK_TIMESTAMP(), -- action_tstamp_clk
        TXID_CURRENT(), -- transaction ID
        CURRENT_SETTING('application_name'), -- client application
        INET_CLIENT_ADDR(), -- client_addr
        INET_CLIENT_PORT(), -- client_port
        CURRENT_QUERY(), -- top-level query or queries (if multistatement) from client
        SUBSTRING(tg_op, 1, 1), -- action
        NULL, NULL, -- row_data, changed_fields
        'f', -- statement_only
        (hasura ->> 'x-hasura-user-id')::uuid -- user_id
        );

    IF
NOT tg_argv[0]::boolean IS DISTINCT FROM 'f'::boolean THEN audit_row.client_query = NULL;
END IF;

    IF
tg_argv[1] IS NOT NULL THEN excluded_cols = tg_argv[1]::text[];
END IF;

    IF
(tg_op = 'UPDATE' AND tg_level = 'ROW') THEN
        old_r = TO_JSONB(OLD);
        new_r
= TO_JSONB(NEW);
        audit_row.row_data
= old_r - excluded_cols;
SELECT jsonb_object_agg(new_t.key, new_t.value) - excluded_cols
INTO audit_row.changed_fields
FROM jsonb_each(old_r) AS old_t
         JOIN jsonb_each(new_r) AS new_t
              ON (old_t.key = new_t.key AND old_t.value <> new_t.value);
ELSIF
(tg_op = 'DELETE' AND tg_level = 'ROW') THEN
        audit_row.row_data = TO_JSONB(OLD) - excluded_cols;
    ELSIF
(tg_op = 'INSERT' AND tg_level = 'ROW') THEN
        audit_row.row_data = TO_JSONB(NEW) - excluded_cols;
    ELSIF
(tg_level = 'STATEMENT' AND tg_op IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE')) THEN
        audit_row.statement_only = 't';
ELSE
        RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',tg_op, tg_level;
RETURN NULL;
END IF;
INSERT INTO audit.logged_actions
VALUES (audit_row.*);
RETURN NULL;
END;
$$;


ALTER FUNCTION audit.if_modified_func() OWNER TO astra50;

--
-- Name: FUNCTION if_modified_func(); Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON FUNCTION audit.if_modified_func() IS '
Track changes to a table at the statement and/or row level.

Optional parameters to trigger in CREATE TRIGGER call:

param 0: boolean, whether to log the query text. Default ''t''.

param 1: text[], columns to ignore in updates. Default [].

         Updates to ignored cols are omitted from changed_fields.

         Updates with only ignored cols changed are not inserted
         into the audit log.

         Almost all the processing work is still done for updates
         that ignored. If you need to save the load, you need to use
         WHEN clause on the trigger instead.

         No warning or error is issued if ignored_cols contains columns
         that do not exist in the target table. This lets you specify
         a standard set of ignored columns.

There is no parameter to disable logging of values. Add this trigger as
a ''FOR EACH STATEMENT'' rather than ''FOR EACH ROW'' trigger if you do not
want to log row values.

Note that the user name logged is the login role for the session. The audit trigger
cannot obtain the active role because it is reset by the SECURITY DEFINER invocation
of the audit trigger its self.
';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: astra50
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE SQL AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO astra50;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: astra50
--

CREATE FUNCTION hdb_catalog.insert_event_log(SCHEMA_NAME text, TABLE_NAME text, TRIGGER_NAME text, op text,
                                             row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
id text;
    payload
json;
    session_variables
json;
    server_version_num
INT;
    trace_context
json;
BEGIN
    id
:= gen_random_uuid();
    server_version_num
:= current_setting('server_version_num');
    IF
server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
      trace_context
:= current_setting('hasura.tracecontext', 't');
ELSE
BEGIN
        session_variables
:= current_setting('hasura.user');
EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
END;
BEGIN
        trace_context
:= current_setting('hasura.tracecontext');
EXCEPTION WHEN OTHERS THEN
        trace_context := NULL;
END;
END IF;
    payload
:= json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables,
      'trace_context', trace_context
    );
INSERT INTO hdb_catalog.event_log
    (id, schema_name, table_name, trigger_name, payload)
VALUES (id, schema_name, table_name, trigger_name, payload);
RETURN id;
END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(SCHEMA_NAME text, TABLE_NAME text, TRIGGER_NAME text, op text, row_data json) OWNER TO astra50;

--
-- Name: notify_hasura_gate_open_INSERT(); Type: FUNCTION; Schema: hdb_catalog; Owner: astra50
--

CREATE FUNCTION hdb_catalog."notify_hasura_gate_open_INSERT"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
_old record;
    _new record;
    _data json;
BEGIN
    IF
TG_OP = 'UPDATE' THEN
      _old := ROW((SELECT  "e"  FROM  (SELECT  OLD."reason_id" , OLD."source" , OLD."created_at" , OLD."id" , OLD."gate_id" , OLD."comment" , OLD."updated_at" , OLD."person_id"        ) AS "e"      ) );
      _new
:= ROW((SELECT  "e"  FROM  (SELECT  NEW."reason_id" , NEW."source" , NEW."created_at" , NEW."id" , NEW."gate_id" , NEW."comment" , NEW."updated_at" , NEW."person_id"        ) AS "e"      ) );
ELSE
    /* initialize _old and _new with dummy values for INSERT and UPDATE events*/
      _old := ROW((SELECT 1));
      _new
:= ROW((SELECT 1));
END IF;
    _data
:= json_build_object(
      'old', NULL,
      'new', row_to_json((SELECT  "e"  FROM  (SELECT  NEW."reason_id" , NEW."source" , NEW."created_at" , NEW."id" , NEW."gate_id" , NEW."comment" , NEW."updated_at" , NEW."person_id"        ) AS "e"      ) )
    );
BEGIN
    /* NOTE: formerly we used TG_TABLE_NAME in place of tableName here. However in the case of
    partitioned tables this will give the name of the partitioned table and since we use the table name to
    get the event trigger configuration from the schema, this fails because the event trigger is only created
    on the original table.  */
      IF
(TG_OP <> 'UPDATE') OR (_old <> _new) THEN
        PERFORM hdb_catalog.insert_event_log(CAST('public' AS text), CAST('gate_open' AS text), CAST('gate_open' AS text), TG_OP, _data);
END IF;
EXCEPTION WHEN undefined_function THEN
        IF (TG_OP <> 'UPDATE') OR (_old *<> _new) THEN
          PERFORM hdb_catalog.insert_event_log(CAST('public' AS text), CAST('gate_open' AS text), CAST('gate_open' AS text), TG_OP, _data);
END IF;
END;

RETURN NULL;
END;
$$;


ALTER FUNCTION hdb_catalog."notify_hasura_gate_open_INSERT"() OWNER TO astra50;

--
-- Name: account_trigger_balance(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.account_trigger_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
NEW.account_id IS NULL OR NEW.account_id <> OLD.account_id THEN
        PERFORM set_account_balance(OLD.account_id);
END IF;

    IF
NEW.account_id IS NOT NULL THEN PERFORM set_account_balance(NEW.account_id);
END IF;

RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;


ALTER FUNCTION public.account_trigger_balance() OWNER TO astra50;

--
-- Name: accrue_monthly_payments(date); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.accrue_monthly_payments(on_date DATE) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
rate record;
BEGIN
SELECT *
INTO rate
FROM member_rate
WHERE since <= on_date
  AND until >= on_date LIMIT 1;

INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at, is_discount, is_regular)
SELECT discount.account_id,
       (rate.amount * land.square) * (rate.discount::NUMERIC(4, 2) / 100),
       land.id,
       rate.id,
       rate.discount,
       now(),
       TRUE,
       TRUE
FROM member_discount discount
         JOIN account_land al
              ON al.account_id = discount.account_id
         JOIN land
              ON al.land_id = land.id
WHERE rate.discount > 0
  AND discount.rate_id = rate.id;

INSERT INTO member_payment (account_id, amount, land_id, rate_id, rate, paid_at, is_regular)
SELECT account.id,
       rate.amount * land.square * -1,
       land.id,
       rate.id,
       rate.amount,
       now(),
       TRUE
FROM account
         JOIN account_land al
              ON al.account_id = account.id
         JOIN land
              ON al.land_id = land.id
WHERE account.end_at IS NULL;
END;
$$;


ALTER FUNCTION public.accrue_monthly_payments(on_date DATE) OWNER TO astra50;

--
-- Name: add_account_person_trigger_account(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.add_account_person_trigger_account() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
(tg_op = 'UPDATE') THEN
        IF NEW.person_id <> OLD.person_id THEN
DELETE
FROM account_person
WHERE person_id = old.person_id
  AND account_id = old.id;
INSERT INTO account_person (person_id, account_id)
VALUES (new.person_id, new.id);
END IF;

RETURN new;
ELSIF
(tg_op = 'INSERT') THEN
        INSERT INTO account_person (person_id, account_id) VALUES (NEW.person_id, NEW.id);

RETURN new;
END IF;

    PERFORM
set_person_last_payment(person_id) FROM account_person WHERE account_id = NEW.id;

RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;


ALTER FUNCTION public.add_account_person_trigger_account() OWNER TO astra50;

--
-- Name: calculate_member_payment_balance(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.calculate_member_payment_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM
calculate_member_payment_balance_by_account_id(NEW.account_id);

    IF
(OLD.account_id <> NEW.account_id) THEN
        PERFORM calculate_member_payment_balance_by_account_id(OLD.account_id);
END IF;

RETURN NULL;
END ;
$$;


ALTER FUNCTION public.calculate_member_payment_balance() OWNER TO astra50;

--
-- Name: calculate_member_payment_balance_by_account_id(uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.calculate_member_payment_balance_by_account_id(_id uuid) RETURNS void
    LANGUAGE SQL AS $$
UPDATE member_payment
SET balance = sub.balance FROM (SELECT id,
               (SELECT SUM(sub.amount)
                  FROM member_payment sub
                 WHERE sub.account_id = mp.account_id AND sub.paid_at <= mp.paid_at) AS balance
          FROM member_payment mp
         WHERE account_id = _id) sub
WHERE member_payment.id = sub.id
  AND (member_payment.balance IS NULL
   OR member_payment.balance <> sub.balance);
$$;


ALTER FUNCTION public.calculate_member_payment_balance_by_account_id(_id uuid) OWNER TO astra50;

--
-- Name: gate_open_find_person_id(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.gate_open_find_person_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.person_id
= CASE WHEN (NEW.reason_id = 'telephone')
                             THEN (SELECT person_id FROM PUBLIC.person_phone WHERE phone = NEW.source)
                         WHEN (NEW.reason_id = 'telegram')
                             THEN (SELECT id FROM PUBLIC.person WHERE telegram_id = NEW.source)
                         WHEN (NEW.reason_id = 'site')
                             THEN (SELECT person_id FROM PUBLIC.person_email WHERE email = NEW.source)
                         WHEN (NEW.reason_id = 'app') THEN (SELECT id FROM PUBLIC.person WHERE user_id = NEW.source::uuid)
                         WHEN (NEW.reason_id = 'token') THEN (SELECT personal_access_token.person_id
                                                                FROM PUBLIC.personal_access_token
                                                               WHERE id = NEW.source::uuid)
END;

RETURN new;
END;
$$;


ALTER FUNCTION public.gate_open_find_person_id() OWNER TO astra50;

--
-- Name: gate_open_set_person_on_email(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.gate_open_set_person_on_email() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE public.gate_open
SET person_id = new.person_id
WHERE public.gate_open.source = new.email;

IF
OLD.email <> NEW.email THEN
UPDATE public.gate_open
SET person_id = NULL
WHERE public.gate_open.source = old.email;
END IF;

RETURN NULL;
END;
$$;


ALTER FUNCTION public.gate_open_set_person_on_email() OWNER TO astra50;

--
-- Name: gate_open_set_person_on_phone(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.gate_open_set_person_on_phone() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE public.gate_open
SET person_id = new.person_id
WHERE public.gate_open.source = new.phone;

IF
OLD.phone <> OLD.phone THEN
UPDATE public.gate_open
SET person_id = NULL
WHERE public.gate_open.source = old.phone;
END IF;

RETURN NULL;
END;
$$;


ALTER FUNCTION public.gate_open_set_person_on_phone() OWNER TO astra50;

--
-- Name: gate_open_set_person_on_telegram_id(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.gate_open_set_person_on_telegram_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
NEW.telegram_id THEN
UPDATE public.gate_open
SET person_id = new.id
WHERE public.gate_open.source = new.telegram_id;
END IF;

    if
OLD.telegram_id <> NEW.telegram_id THEN
UPDATE public.gate_open
SET person_id = NULL
WHERE public.gate_open.source = old.telegram_id;
END IF;

RETURN NULL;
END;
$$;


ALTER FUNCTION public.gate_open_set_person_on_telegram_id() OWNER TO astra50;

SET
default_tablespace = '';

SET
default_table_access_method = heap;

--
-- Name: gate_open; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.gate_open
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    gate_id    uuid                                               NOT NULL,
    reason_id  text                                               NOT NULL,
    source     text                                               NOT NULL,
    comment    text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    person_id  uuid
);


ALTER TABLE public.gate_open OWNER TO astra50;

--
-- Name: open_gate(text, uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.open_gate(token text, gate uuid) RETURNS setof PUBLIC.gate_open
    LANGUAGE plpgsql
    AS $_$
DECLARE
_token    PUBLIC.personal_access_token;
    last_open
PUBLIC.gate_open;
    _gate
PUBLIC.gate;
BEGIN
SELECT *
INTO _token
FROM personal_access_token pat
WHERE pat.token = $1;
SELECT *
INTO _gate
FROM public.gate
WHERE id = $2;

IF
_token IS NULL THEN RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'Unauthorized';
END IF;
    IF
NOT _token.gate_access THEN RAISE EXCEPTION USING ERRCODE = '0P000', MESSAGE = 'Unauthorized';
END IF;

SELECT *
INTO last_open
FROM public.gate_open
WHERE source = _token.id::text
ORDER BY created_at DESC LIMIT 1;

IF
NOW() < last_open.created_at + INTERVAL '1 second' * _gate.delay THEN
        RAISE EXCEPTION 'Too many requests';
END IF;

RETURN query WITH inserted_row AS (INSERT INTO PUBLIC.gate_open (gate_id, reason_id, SOURCE) VALUES ($2,
                                                                                                         'token',
                                                                                                         _token.id) RETURNING *)
SELECT *
FROM inserted_row;

END
$_$;


ALTER FUNCTION public.open_gate(token text, gate uuid) OWNER TO astra50;

--
-- Name: open_gate_site(text); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.open_gate_site(gate text) RETURNS setof PUBLIC.gate_open
    LANGUAGE plpgsql
    AS $$
DECLARE
session_variables jsonb;
BEGIN
    session_variables
:= CURRENT_SETTING('hasura.user', 't');

RETURN query WITH inserted_row AS (INSERT INTO PUBLIC.gate_open (gate_id, reason_id, SOURCE) VALUES (gate::uuid,
                                                                                                         'app',
                                                                                                         session_variables ->>
                                                                                                         'x-hasura-user-id') RETURNING *)
SELECT *
FROM inserted_row;

END
$$;


ALTER FUNCTION public.open_gate_site(gate text) OWNER TO astra50;

--
-- Name: person_balance_trigger_account(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.person_balance_trigger_account() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM
set_person_balance(person_id) FROM account_person WHERE account_id = NEW.id;

RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;


ALTER FUNCTION public.person_balance_trigger_account() OWNER TO astra50;

--
-- Name: person_balance_trigger_account_person(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.person_balance_trigger_account_person() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
(tg_op = 'DELETE') THEN
        PERFORM set_account_balance(OLD.account_id);
        PERFORM
set_person_balance(OLD.person_id);

RETURN old;
ELSIF
(tg_op = 'UPDATE') THEN
        IF NEW.account_id <> OLD.account_id THEN PERFORM set_account_balance(OLD.account_id);
END IF;
        IF
NEW.person_id <> OLD.person_id THEN PERFORM set_person_balance(OLD.person_id);
END IF;

RETURN new;
ELSIF
(tg_op = 'INSERT') THEN
        PERFORM set_account_balance(NEW.account_id);
        PERFORM
set_person_balance(NEW.person_id);

RETURN new;
END IF;

RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;


ALTER FUNCTION public.person_balance_trigger_account_person() OWNER TO astra50;

--
-- Name: person_last_paid_trigger_member_payment(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.person_last_paid_trigger_member_payment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
(tg_op = 'DELETE') THEN
        PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_person.account_id = OLD.account_id;

RETURN old;
ELSIF
(tg_op = 'UPDATE') THEN
        IF NEW.account_id <> OLD.account_id THEN
            PERFORM set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = OLD.account_id;

            PERFORM
set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = NEW.account_id;
        ELSEIF
NEW.amount <> OLD.amount OR NEW.paid_at <> OLD.paid_at THEN
            PERFORM set_person_last_payment(person_id)
               FROM account_person
              WHERE account_person.account_id = NEW.account_id;
END IF;

RETURN new;
ELSIF
(tg_op = 'INSERT') THEN
        PERFORM set_person_last_payment(person_id) FROM account_person WHERE account_person.account_id = NEW.account_id;

RETURN new;
END IF;

    PERFORM
set_person_last_payment(person_id) FROM account_person WHERE account_id = NEW.id;

RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$;


ALTER FUNCTION public.person_last_paid_trigger_member_payment() OWNER TO astra50;

--
-- Name: positional(regclass, text, text); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.positional(tbl regclass, group_by text, order_by text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
    PERFORM
PUBLIC.positional(tbl, 'position', $2, $3);
END;
$_$;


ALTER FUNCTION public.positional(tbl regclass, group_by text, order_by text) OWNER TO astra50;

--
-- Name: positional(regclass, text, text, text); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.positional(tbl regclass, clm text, group_by text, order_by text) RETURNS void
    LANGUAGE plpgsql
    AS $_X$
BEGIN
EXECUTE 'ALTER TABLE ' || tbl || ' DROP COLUMN IF EXISTS ' || clm;

EXECUTE 'ALTER TABLE ' || tbl || ' ADD COLUMN ' || clm || ' integer DEFAULT 0 NOT NULL CHECK ( ' || clm ||
        ' >= 0 )';

EXECUTE 'UPDATE ' || tbl || '
    SET ' || clm || ' = sub.' || clm || '
    FROM (
             SELECT ' || group_by || ', ' || order_by || ', ROW_NUMBER() OVER (PARTITION BY ' || group_by ||
        ' ORDER BY ' || order_by || ') as ' || clm || '
             FROM ' || tbl || '
         ) as sub
    WHERE ' || tbl || '.' || group_by || ' = sub.' || group_by || '
      AND ' || tbl || '.' || order_by || ' = sub.' || order_by || ';
    ';

EXECUTE 'ALTER TABLE ' || tbl || ' ALTER COLUMN ' || clm || ' DROP DEFAULT';

EXECUTE $$
CREATE
OR REPLACE FUNCTION $$ || tbl || $$_$$ || clm || $$() RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$trigger$
DECLARE
MAX INTEGER;
BEGIN
SELECT COALESCE(MAX($$ || clm || $$), 0)
INTO MAX
FROM $$ || tbl || $$;

IF
(tg_op = 'INSERT') THEN
        IF NEW.$$ || clm || $$ IS NULL OR NEW.$$ || clm || $$ <= 0 THEN
            NEW.$$ || clm || $$ = MAX + 1;
        ELSEIF
(NEW.$$ || clm || $$ > MAX + 1) THEN
            NEW.$$ || clm || $$ = MAX + 1;
END IF;
    ELSEIF
(tg_op = 'UPDATE') THEN
        IF NEW.$$ || clm || $$ < 1 THEN
            NEW.$$ || clm || $$ = 1;
        ELSEIF
NEW.$$ || clm || $$ > MAX AND OLD.$$ || clm || $$ = MAX THEN
            NEW.$$ || clm || $$ = MAX;
END IF;

        IF
(OLD.$$ || clm || $$ < NEW.$$ || clm || $$) THEN
UPDATE $$ || tbl || $$
SET $$ || clm || $$ = $$ || clm || $$ - 1
WHERE $$ || clm || $$ <= NEW.$$ || clm || $$
  AND $$ || clm || $$
    > OLD.$$ || clm || $$
  AND id <> NEW.id;
ELSEIF
(OLD.$$ || clm || $$ > NEW.$$ || clm || $$) THEN
UPDATE $$ || tbl || $$
SET $$ || clm || $$ = $$ || clm || $$ + 1
WHERE $$ || clm || $$ >= NEW.$$ || clm || $$
  AND $$ || clm || $$
    < OLD.$$ || clm || $$
  AND id <> NEW.id;
END IF;
END IF;

RETURN new;
END;
$trigger$;
        $$;

EXECUTE $$
CREATE TRIGGER $$ || clm || $$_positional
    BEFORE INSERT OR
UPDATE of $$ || clm || $$
ON $$ || tbl || $$
    FOR EACH ROW
    WHEN (PG_TRIGGER_DEPTH() = 0)
    EXECUTE FUNCTION $$ || tbl || $$_$$ || clm || $$()
;
$$;
END ;
$_X$;


ALTER FUNCTION public.positional(tbl regclass, clm text, group_by text, order_by text) OWNER TO astra50;

--
-- Name: set_account_balance(uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_account_balance(uuid) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
UPDATE account
SET balance    = (SELECT COALESCE((SELECT SUM(amount) FROM member_payment WHERE account_id = $1), 0.00)),
    balance_at = now()
WHERE id = $1;
END;
$_$;


ALTER FUNCTION public.set_account_balance(uuid) OWNER TO astra50;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
_new record;
BEGIN
    _new
:= NEW;
    _new.updated_at
= NOW();
RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO astra50;

--
-- Name: FUNCTION set_current_timestamp_updated_at(); Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON FUNCTION PUBLIC.set_current_timestamp_updated_at() IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: set_person_balance(uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_person_balance(uuid) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
UPDATE person
SET balance    = (SELECT COALESCE((SELECT SUM(balance)
                                   FROM account
                                            JOIN account_person
                                                 ON account.id = account_person.account_id
                                   WHERE account_person.person_id = $1), 0.00)),
    balance_at = now()
WHERE id = $1;
END;
$_$;


ALTER FUNCTION public.set_person_balance(uuid) OWNER TO astra50;

--
-- Name: set_person_email_is_main_to_false(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_person_email_is_main_to_false() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
NEW.is_main IS TRUE THEN
UPDATE public.person_email
SET is_main = FALSE
WHERE person_id = new.person_id
  AND id <> new.id;
END IF;

RETURN new;
END;
$$;


ALTER FUNCTION public.set_person_email_is_main_to_false() OWNER TO astra50;

--
-- Name: set_person_last_payment(uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_person_last_payment(uuid) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
payment record;
BEGIN
SELECT
INTO payment amount, paid_at
FROM account_person
    JOIN member_payment mp
ON account_person.account_id = mp.account_id AND mp.amount > 0 AND mp.is_discount IS FALSE
WHERE account_person.person_id = $1
ORDER BY mp.paid_at DESC
    LIMIT 1;

UPDATE person
SET last_paid_amount = payment.amount,
    last_paid_at     = payment.paid_at
WHERE id = $1
  AND last_paid_amount <> payment.amount
  AND last_paid_at <> payment.paid_at;
END;
$_$;


ALTER FUNCTION public.set_person_last_payment(uuid) OWNER TO astra50;

--
-- Name: set_person_phone_is_main_to_false(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_person_phone_is_main_to_false() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
NEW.is_main IS TRUE THEN
UPDATE public.person_phone
SET is_main = FALSE
WHERE person_id = new.person_id
  AND id <> new.id;
END IF;

RETURN new;
END;
$$;


ALTER FUNCTION public.set_person_phone_is_main_to_false() OWNER TO astra50;

--
-- Name: set_target_amount(); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_target_amount() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF
NEW.target_id <> OLD.target_id THEN PERFORM PUBLIC.set_target_amount(OLD.target_id);
END IF;

    PERFORM
PUBLIC.set_target_amount(NEW.target_id);

RETURN new;
END;
$$;


ALTER FUNCTION public.set_target_amount() OWNER TO astra50;

--
-- Name: set_target_amount(uuid); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.set_target_amount(uuid) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
UPDATE public.target
SET current_amount   = COALESCE((SELECT SUM(amount) FROM target_payment WHERE target_id = $1), 0),
    increment_amount = COALESCE((SELECT SUM(amount) FROM target_payment WHERE target_id = $1 AND amount > 0), 0),
    decrement_amount = COALESCE((SELECT SUM(amount) FROM target_payment WHERE target_id = $1 AND amount < 0), 0)
WHERE id = $1;
END;
$_$;


ALTER FUNCTION public.set_target_amount(uuid) OWNER TO astra50;

--
-- Name: timestampable(regclass); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.timestampable(target_table regclass) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
EXECUTE 'ALTER TABLE ' || target_table || ' ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT NOW()';
EXECUTE 'ALTER TABLE ' || target_table || ' ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT NOW()';

EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON ' || target_table ||
        ' FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at()';
END ;
$$;


ALTER FUNCTION public.timestampable(target_table regclass) OWNER TO astra50;

--
-- Name: timestampable_drop(regclass); Type: FUNCTION; Schema: public; Owner: astra50
--

CREATE FUNCTION public.timestampable_drop(target_table regclass) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
EXECUTE 'DROP TRIGGER IF EXISTS set_updated_at ON ' || target_table;
EXECUTE 'ALTER TABLE ' || target_table || ' DROP COLUMN created_at';
EXECUTE 'ALTER TABLE ' || target_table || ' DROP COLUMN updated_at';
END ;
$$;


ALTER FUNCTION public.timestampable_drop(target_table regclass) OWNER TO astra50;

--
-- Name: logged_actions; Type: TABLE; Schema: audit; Owner: astra50
--

CREATE TABLE audit.logged_actions
(
    event_id          bigint                   NOT NULL,
    schema_name       text                     NOT NULL,
    table_name        text                     NOT NULL,
    relid             oid                      NOT NULL,
    session_user_name text,
    hasura_user       jsonb,
    action_tstamp_tx  timestamp WITH TIME ZONE NOT NULL,
    action_tstamp_stm timestamp WITH TIME ZONE NOT NULL,
    action_tstamp_clk timestamp WITH TIME ZONE NOT NULL,
    transaction_id    bigint,
    application_name  text,
    client_addr       inet,
    client_port       integer,
    client_query      text,
    action            text                     NOT NULL,
    row_data          jsonb,
    changed_fields    jsonb,
    statement_only    boolean                  NOT NULL,
    user_id           uuid,
    CONSTRAINT logged_actions_action_check CHECK ((ACTION = ANY (ARRAY['I'::text, 'D'::text, 'U'::text, 'T'::text])))
);


ALTER TABLE audit.logged_actions OWNER TO astra50;

--
-- Name: TABLE logged_actions; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON TABLE audit.logged_actions IS 'History of auditable actions on audited tables, from audit.if_modified_func()';


--
-- Name: COLUMN logged_actions.event_id; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.event_id IS 'Unique identifier for each auditable event';


--
-- Name: COLUMN logged_actions.schema_name; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.schema_name IS 'Database schema audited table for this event is in';


--
-- Name: COLUMN logged_actions.table_name; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.table_name IS 'Non-schema-qualified table name of table event occured in';


--
-- Name: COLUMN logged_actions.relid; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.relid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';


--
-- Name: COLUMN logged_actions.session_user_name; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.session_user_name IS 'Login / session user whose statement caused the audited event';


--
-- Name: COLUMN logged_actions.action_tstamp_tx; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.action_tstamp_tx IS 'Transaction start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_stm; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.action_tstamp_stm IS 'Statement start timestamp for tx in which audited event occurred';


--
-- Name: COLUMN logged_actions.action_tstamp_clk; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.action_tstamp_clk IS 'Wall clock time at which audited event''s trigger call occurred';


--
-- Name: COLUMN logged_actions.transaction_id; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.transaction_id IS 'Identifier of transaction that made the change. May wrap, but unique paired with action_tstamp_tx.';


--
-- Name: COLUMN logged_actions.application_name; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.application_name IS 'Application name set when this audit event occurred. Can be changed in-session by client.';


--
-- Name: COLUMN logged_actions.client_addr; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.client_addr IS 'IP address of client that issued query. Null for unix domain socket.';


--
-- Name: COLUMN logged_actions.client_port; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.client_port IS 'Remote peer IP port address of client that issued query. Undefined for unix socket.';


--
-- Name: COLUMN logged_actions.client_query; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.client_query IS 'Top-level query that caused this auditable event. May be more than one statement.';


--
-- Name: COLUMN logged_actions.action; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.action IS 'Action type; I = insert, D = delete, U = update, T = truncate';


--
-- Name: COLUMN logged_actions.row_data; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.row_data IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';


--
-- Name: COLUMN logged_actions.changed_fields; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.changed_fields IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';


--
-- Name: COLUMN logged_actions.statement_only; Type: COMMENT; Schema: audit; Owner: astra50
--

COMMENT
ON COLUMN audit.logged_actions.statement_only IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';


--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE; Schema: audit; Owner: astra50
--

CREATE SEQUENCE audit.logged_actions_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;


ALTER TABLE audit.logged_actions_event_id_seq OWNER TO astra50;

--
-- Name: logged_actions_event_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: astra50
--

ALTER SEQUENCE audit.logged_actions_event_id_seq OWNED BY audit.logged_actions.event_id;


--
-- Name: table; Type: VIEW; Schema: audit; Owner: astra50
--

CREATE VIEW audit."table" AS
SELECT DISTINCT a.table_name AS id
FROM audit.logged_actions a;


ALTER TABLE audit."table" OWNER TO astra50;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: astra50
--

CREATE TABLE hdb_catalog.event_invocation_logs
(
    id           text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id     text,
    status       integer,
    request      json,
    response     json,
    created_at   timestamp WITHOUT TIME ZONE DEFAULT now(),
    trigger_name text
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO astra50;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: astra50
--

CREATE TABLE hdb_catalog.event_log
(
    id            text    DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    schema_name   text                                          NOT NULL,
    table_name    text                                          NOT NULL,
    trigger_name  text                                          NOT NULL,
    payload       jsonb                                         NOT NULL,
    delivered     boolean DEFAULT FALSE                         NOT NULL,
    error         boolean DEFAULT FALSE                         NOT NULL,
    tries         integer DEFAULT 0                             NOT NULL,
    created_at    timestamp WITHOUT TIME ZONE DEFAULT now(),
    locked        timestamp WITH TIME ZONE,
    next_retry_at timestamp WITHOUT TIME ZONE,
    archived      boolean DEFAULT FALSE                         NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO astra50;

--
-- Name: hdb_event_log_cleanups; Type: TABLE; Schema: hdb_catalog; Owner: astra50
--

CREATE TABLE hdb_catalog.hdb_event_log_cleanups
(
    id                            text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name                  text                                       NOT NULL,
    scheduled_at                  timestamp WITHOUT TIME ZONE NOT NULL,
    deleted_event_logs            integer,
    deleted_event_invocation_logs integer,
    status                        text                                       NOT NULL,
    CONSTRAINT hdb_event_log_cleanups_status_check CHECK ((status = ANY
                                                           (array['scheduled'::text, 'paused'::text, 'completed'::text,
                                                            'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_event_log_cleanups OWNER TO astra50;

--
-- Name: hdb_source_catalog_version; Type: TABLE; Schema: hdb_catalog; Owner: astra50
--

CREATE TABLE hdb_catalog.hdb_source_catalog_version
(
    version     text                     NOT NULL,
    upgraded_on timestamp WITH TIME ZONE NOT NULL
);


ALTER TABLE hdb_catalog.hdb_source_catalog_version OWNER TO astra50;

--
-- Name: account; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.account
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    number     text                                               NOT NULL,
    comment    text,
    person_id  uuid,
    balance    numeric(10, 2)           DEFAULT 0                 NOT NULL,
    balance_at timestamp WITH TIME ZONE DEFAULT now(),
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    end_at     date
);


ALTER TABLE public.account OWNER TO astra50;

--
-- Name: account_land; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.account_land
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    land_id    uuid                                               NOT NULL,
    account_id uuid                                               NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.account_land OWNER TO astra50;

--
-- Name: account_person; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.account_person
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    person_id  uuid                                               NOT NULL,
    account_id uuid                                               NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.account_person OWNER TO astra50;

--
-- Name: cctv; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.cctv
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name       text                                               NOT NULL,
    comment    text,
    url        text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    preview    text
);


ALTER TABLE public.cctv OWNER TO astra50;

--
-- Name: contact; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.contact
(
    id          uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name        text                                               NOT NULL,
    description text,
    comment     text,
    phone PUBLIC.phone_number,
    site        text,
    is_public   boolean                  DEFAULT FALSE,
    "position"  integer,
    created_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.contact OWNER TO astra50;

--
-- Name: contractor; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.contractor
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name       text                                               NOT NULL,
    comment    text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.contractor OWNER TO astra50;

--
-- Name: gate; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.gate
(
    id                uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name              text                                               NOT NULL,
    phone             text,
    created_at        timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at        timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    coordinates       point,
    number            integer,
    delay             integer                                            NOT NULL,
    cctv_id           uuid,
    cctv_preview_rate integer                  DEFAULT 0                 NOT NULL,
    CONSTRAINT not_lower_then_2000 CHECK (((cctv_preview_rate = 0) OR (cctv_preview_rate >= 2000)))
);


ALTER TABLE public.gate OWNER TO astra50;

--
-- Name: gate_open_reason; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.gate_open_reason
(
    id         text                                   NOT NULL,
    name       text                                   NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);


ALTER TABLE public.gate_open_reason OWNER TO astra50;

--
-- Name: land; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.land
(
    id               uuid                     DEFAULT gen_random_uuid() NOT NULL,
    street_id        uuid                                               NOT NULL,
    number           text,
    cadastral_number text,
    square           numeric(10, 2)                                     NOT NULL,
    created_at       timestamp WITH TIME ZONE DEFAULT now(),
    updated_at       timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    number_integer   integer GENERATED ALWAYS AS ((NUMBER)::INTEGER
) STORED,
    coordinates point,
    polygon polygon
);


ALTER TABLE public.land OWNER TO astra50;

--
-- Name: TABLE land; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.land IS 'Земельные участки';


--
-- Name: person; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.person
(
    id                   uuid                     DEFAULT gen_random_uuid() NOT NULL,
    firstname            text,
    lastname             text,
    middlename           text,
    birth_date           date,
    created_at           timestamp WITH TIME ZONE DEFAULT now(),
    balance              numeric(10, 2)           DEFAULT 0,
    balance_at           timestamp WITH TIME ZONE DEFAULT now(),
    telegram_id          text,
    updated_at           timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    last_paid_amount     numeric,
    last_paid_at         date,
    comment              text,
    entered_at           date,
    entered_document     text,
    passport_serial      character varying(10),
    passport_number      character varying(10),
    passport_issued_by   character varying(100),
    passport_issued_date date,
    passport_issued_code character varying(7),
    registration_address character varying(200),
    full_name            text GENERATED ALWAYS AS (TRIM(BOTH FROM ((((COALESCE(lastname, ''::text) || ' '::text) ||
                                                                     COALESCE(firstname, ''::text)) || ' '
                                                        ::text) || COALESCE(middlename, ''::text)))) STORED NOT NULL,
    user_id              uuid
);


ALTER TABLE public.person OWNER TO astra50;

--
-- Name: TABLE person; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.person IS 'Члены СНТ';


--
-- Name: me; Type: VIEW; Schema: public; Owner: astra50
--

CREATE VIEW public.me AS
SELECT person.id,
       person.firstname,
       person.lastname,
       person.middlename,
       person.birth_date,
       person.created_at,
       person.balance,
       person.balance_at,
       person.telegram_id,
       person.updated_at,
       person.last_paid_amount,
       person.last_paid_at,
       person.comment,
       person.entered_at,
       person.entered_document,
       person.passport_serial,
       person.passport_number,
       person.passport_issued_by,
       person.passport_issued_date,
       person.passport_issued_code,
       person.registration_address,
       person.full_name,
       person.user_id
FROM public.person;


ALTER TABLE public.me OWNER TO astra50;

--
-- Name: member_discount; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.member_discount
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid                                               NOT NULL,
    rate_id    uuid                                               NOT NULL,
    comment    text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.member_discount OWNER TO astra50;

--
-- Name: member_payment; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.member_payment
(
    id          uuid                     DEFAULT gen_random_uuid() NOT NULL,
    created_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    person_id   uuid,
    amount      numeric(10, 2)                                     NOT NULL,
    comment     text,
    land_id     uuid,
    rate_id     uuid,
    rate        integer,
    paid_at     date                                               NOT NULL,
    is_regular  boolean                  DEFAULT FALSE             NOT NULL,
    updated_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    account_id  uuid                                               NOT NULL,
    is_discount boolean                  DEFAULT FALSE,
    balance     numeric(10, 2),
    CONSTRAINT zero_amount_not_allowed CHECK (((amount <> (0)::NUMERIC) OR (created_at = '2021-11-14 21:36:53.072291+00'::TIMESTAMP WITH TIME ZONE)))
);


ALTER TABLE public.member_payment OWNER TO astra50;

--
-- Name: TABLE member_payment; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.member_payment IS 'Членские взносы';


--
-- Name: COLUMN member_payment.is_regular; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON COLUMN PUBLIC.member_payment.is_regular IS 'Флаг автоматического начисления взносов';


--
-- Name: member_rate; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.member_rate
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    amount     integer                                            NOT NULL,
    since      date                                               NOT NULL,
    until      date                                               NOT NULL,
    comment    text,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    discount   integer                  DEFAULT 0                 NOT NULL
);


ALTER TABLE public.member_rate OWNER TO astra50;

--
-- Name: TABLE member_rate; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.member_rate IS 'Ставка членских взносов';


--
-- Name: refinance_rate; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.refinance_rate
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    rate       numeric(4, 2)                                      NOT NULL,
    since      date                                               NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.refinance_rate OWNER TO astra50;

--
-- Name: payment_with_refinance_rate; Type: VIEW; Schema: public; Owner: astra50
--

CREATE VIEW public.payment_with_refinance_rate AS
SELECT sub.date,
       sub.rate,
       sub.amount,
       sub.balance,
       sub.type,
       sub.account_id
FROM (SELECT mp.paid_at AS DATE,
            ( SELECT refinance_rate.rate
                   FROM PUBLIC.refinance_rate
                  WHERE (refinance_rate.since < mp.paid_at)
                  ORDER BY refinance_rate.since DESC
                 LIMIT 1) AS rate,
            mp.amount,
            mp.balance,
                CASE
                    WHEN (mp.amount > (0)::NUMERIC) THEN 'paid'::text
                    ELSE 'debt'::text
                END AS TYPE,
            mp.account_id
      FROM PUBLIC.member_payment mp
      UNION
      SELECT refinance_rate.since AS DATE, refinance_rate.rate, NULL :: NUMERIC AS "numeric", NULL :: NUMERIC AS "numeric", 'ref_tax'::text AS text, NULL ::uuid AS uuid
      FROM PUBLIC.refinance_rate) sub
ORDER BY sub.date DESC;


ALTER TABLE public.payment_with_refinance_rate OWNER TO astra50;

--
-- Name: person_email; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.person_email
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    email PUBLIC.email NOT NULL,
    person_id  uuid                                               NOT NULL,
    is_main    boolean                  DEFAULT FALSE             NOT NULL,
    comment    text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.person_email OWNER TO astra50;

--
-- Name: person_phone; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.person_phone
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    phone PUBLIC.phone_number NOT NULL,
    person_id  uuid                                               NOT NULL,
    is_main    boolean                  DEFAULT FALSE             NOT NULL,
    comment    text,
    created_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.person_phone OWNER TO astra50;

--
-- Name: personal_access_token; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.personal_access_token
(
    id          uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name        text                                               NOT NULL,
    token       text                     DEFAULT replace((gen_random_uuid())::text, '-'::text, ''::text),
    gate_access boolean                                            NOT NULL,
    person_id   uuid                                               NOT NULL,
    created_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    updated_at  timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.personal_access_token OWNER TO astra50;

--
-- Name: street; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.street
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    name       text                                               NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now(),
    updated_at timestamp WITH TIME ZONE DEFAULT now()             NOT NULL
);


ALTER TABLE public.street OWNER TO astra50;

--
-- Name: TABLE street; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.street IS 'Улицы';


--
-- Name: target; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.target
(
    id               uuid                     DEFAULT gen_random_uuid() NOT NULL,
    created_at       timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    name             text                                               NOT NULL,
    comment          text,
    initial_amount   numeric(10, 2)           DEFAULT 0                 NOT NULL,
    total_amount     numeric(10, 2)           DEFAULT 0                 NOT NULL,
    payer_amount     numeric(10, 2),
    current_amount   numeric(10, 2)           DEFAULT 0                 NOT NULL,
    updated_at       timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    is_public        boolean                  DEFAULT FALSE             NOT NULL,
    lands            jsonb                    DEFAULT '[]'::jsonb NOT NULL,
    increment_amount numeric(10, 2)           DEFAULT 0                 NOT NULL,
    decrement_amount numeric(10, 2)           DEFAULT 0                 NOT NULL
);


ALTER TABLE public.target OWNER TO astra50;

--
-- Name: TABLE target; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.target IS 'Статьи целевых взносов';


--
-- Name: COLUMN target.total_amount; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON COLUMN PUBLIC.target.total_amount IS 'Целевая сумма';


--
-- Name: target_payment; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.target_payment
(
    id            uuid                     DEFAULT gen_random_uuid() NOT NULL,
    created_at    timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    person_id     uuid,
    land_id       uuid,
    comment       text,
    amount        bigint                                             NOT NULL,
    target_id     uuid                                               NOT NULL,
    paid_at       date                                               NOT NULL,
    updated_at    timestamp WITH TIME ZONE DEFAULT now()             NOT NULL,
    contractor_id uuid,
    CONSTRAINT person_and_contractor_must_not_be_both CHECK ((NOT ((person_id IS NOT NULL) AND (contractor_id IS NOT NULL)))),
    CONSTRAINT person_or_contractor_required CHECK (((person_id IS NOT NULL) OR (contractor_id IS NOT NULL))),
    CONSTRAINT zero_amount_not_allowed CHECK ((amount <> 0))
);


ALTER TABLE public.target_payment OWNER TO astra50;

--
-- Name: TABLE target_payment; Type: COMMENT; Schema: public; Owner: astra50
--

COMMENT
ON TABLE PUBLIC.target_payment IS 'Целевые взносы';


--
-- Name: users; Type: TABLE; Schema: public; Owner: astra50
--

CREATE TABLE public.users
(
    id         uuid                                   NOT NULL,
    username   text                                   NOT NULL,
    created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO astra50;

--
-- Name: logged_actions event_id; Type: DEFAULT; Schema: audit; Owner: astra50
--

ALTER TABLE only audit.logged_actions ALTER COLUMN event_id SET DEFAULT nextval('audit.logged_actions_event_id_seq'::regclass);


--
-- Name: logged_actions logged_actions_pkey; Type: CONSTRAINT; Schema: audit; Owner: astra50
--

ALTER TABLE only audit.logged_actions
    ADD CONSTRAINT logged_actions_pkey PRIMARY KEY (event_id);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: astra50
--

ALTER TABLE only hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: astra50
--

ALTER TABLE only hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_event_log_cleanups hdb_event_log_cleanups_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: astra50
--

ALTER TABLE only hdb_catalog.hdb_event_log_cleanups
    ADD CONSTRAINT hdb_event_log_cleanups_pkey PRIMARY KEY (id);


--
-- Name: hdb_event_log_cleanups hdb_event_log_cleanups_trigger_name_scheduled_at_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: astra50
--

ALTER TABLE only hdb_catalog.hdb_event_log_cleanups
    ADD CONSTRAINT hdb_event_log_cleanups_trigger_name_scheduled_at_key UNIQUE (TRIGGER_NAME, scheduled_at);


--
-- Name: account_land account_land_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_land
    ADD CONSTRAINT account_land_pkey PRIMARY KEY (id);


--
-- Name: account_person account_person_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_person
    ADD CONSTRAINT account_person_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: cctv cctv_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.cctv
    ADD CONSTRAINT cctv_pkey PRIMARY KEY (id);


--
-- Name: contact contact_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);


--
-- Name: contractor contractor_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.contractor
    ADD CONSTRAINT contractor_pkey PRIMARY KEY (id);


--
-- Name: gate_open gate_open_log_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate_open
    ADD CONSTRAINT gate_open_log_pkey PRIMARY KEY (id);


--
-- Name: gate_open_reason gate_open_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate_open_reason
    ADD CONSTRAINT gate_open_reason_pkey PRIMARY KEY (id);


--
-- Name: gate gate_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate
    ADD CONSTRAINT gate_pkey PRIMARY KEY (id);


--
-- Name: land land_cadastral_number_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.land
    ADD CONSTRAINT land_cadastral_number_key UNIQUE (cadastral_number);


--
-- Name: land land_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.land
    ADD CONSTRAINT land_pkey PRIMARY KEY (id);


--
-- Name: member_discount member_discount_account_id_rate_id_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_discount
    ADD CONSTRAINT member_discount_account_id_rate_id_key UNIQUE (account_id, rate_id);


--
-- Name: member_discount member_discount_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_discount
    ADD CONSTRAINT member_discount_pkey PRIMARY KEY (id);


--
-- Name: member_payment member_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_payment
    ADD CONSTRAINT member_payment_pkey PRIMARY KEY (id);


--
-- Name: member_rate member_payment_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_rate
    ADD CONSTRAINT member_payment_rate_pkey PRIMARY KEY (id);


--
-- Name: person_email person_email_email_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_email
    ADD CONSTRAINT person_email_email_key UNIQUE (email);


--
-- Name: person_email person_email_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_email
    ADD CONSTRAINT person_email_pkey PRIMARY KEY (id);


--
-- Name: person_phone person_phone_phone_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_phone
    ADD CONSTRAINT person_phone_phone_key UNIQUE (phone);


--
-- Name: person_phone person_phone_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_phone
    ADD CONSTRAINT person_phone_pkey PRIMARY KEY (id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person person_telegram_id_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person
    ADD CONSTRAINT person_telegram_id_key UNIQUE (telegram_id);


--
-- Name: person person_user_id_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person
    ADD CONSTRAINT person_user_id_key UNIQUE (user_id);


--
-- Name: personal_access_token personal_access_token_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.personal_access_token
    ADD CONSTRAINT personal_access_token_pkey PRIMARY KEY (id);


--
-- Name: refinance_rate refinance_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.refinance_rate
    ADD CONSTRAINT refinance_rate_pkey PRIMARY KEY (id);


--
-- Name: refinance_rate refinance_rate_rate_since_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.refinance_rate
    ADD CONSTRAINT refinance_rate_rate_since_key UNIQUE (rate, since);


--
-- Name: street street_name_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.street
    ADD CONSTRAINT street_name_key UNIQUE (NAME);


--
-- Name: street street_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.street
    ADD CONSTRAINT street_pkey PRIMARY KEY (id);


--
-- Name: target_payment target_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target_payment
    ADD CONSTRAINT target_payment_pkey PRIMARY KEY (id);


--
-- Name: target target_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target
    ADD CONSTRAINT target_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: logged_actions_action_idx; Type: INDEX; Schema: audit; Owner: astra50
--

CREATE INDEX logged_actions_action_idx ON audit.logged_actions USING btree (ACTION);


--
-- Name: logged_actions_action_tstamp_tx_stm_idx; Type: INDEX; Schema: audit; Owner: astra50
--

CREATE INDEX logged_actions_action_tstamp_tx_stm_idx ON audit.logged_actions USING btree (action_tstamp_stm);


--
-- Name: logged_actions_relid_idx; Type: INDEX; Schema: audit; Owner: astra50
--

CREATE INDEX logged_actions_relid_idx ON audit.logged_actions USING btree (relid);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: astra50
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_fetch_events; Type: INDEX; Schema: hdb_catalog; Owner: astra50
--

CREATE INDEX event_log_fetch_events ON hdb_catalog.event_log USING btree (locked NULLS FIRST, next_retry_at NULLS FIRST, created_at) WHERE ((delivered = FALSE) AND (error = FALSE) AND (archived = FALSE));


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: astra50
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (TRIGGER_NAME);


--
-- Name: hdb_source_catalog_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: astra50
--

CREATE UNIQUE INDEX hdb_source_catalog_version_one_row ON hdb_catalog.hdb_source_catalog_version USING btree (((version IS NOT NULL)));


--
-- Name: account_land_unique_idx; Type: INDEX; Schema: public; Owner: astra50
--

CREATE UNIQUE INDEX account_land_unique_idx ON public.account_land USING btree (land_id, account_id);


--
-- Name: account_person_unique_idx; Type: INDEX; Schema: public; Owner: astra50
--

CREATE UNIQUE INDEX account_person_unique_idx ON public.account_person USING btree (person_id, account_id);


--
-- Name: gate_open_person_id_idx; Type: INDEX; Schema: public; Owner: astra50
--

CREATE INDEX gate_open_person_id_idx ON public.gate_open USING btree (person_id);


--
-- Name: person_email_only_one_is_main; Type: INDEX; Schema: public; Owner: astra50
--

CREATE UNIQUE INDEX person_email_only_one_is_main ON public.person_email USING btree (person_id, is_main) WHERE (is_main IS TRUE);


--
-- Name: person_email_person_id_idx; Type: INDEX; Schema: public; Owner: astra50
--

CREATE INDEX person_email_person_id_idx ON public.person_email USING btree (person_id);


--
-- Name: person_phone_only_one_main; Type: INDEX; Schema: public; Owner: astra50
--

CREATE UNIQUE INDEX person_phone_only_one_main ON public.person_phone USING btree (person_id, is_main) WHERE (is_main IS TRUE);


--
-- Name: person_phone_person_id_idx; Type: INDEX; Schema: public; Owner: astra50
--

CREATE INDEX person_phone_person_id_idx ON public.person_phone USING btree (person_id);


--
-- Name: account add_person_to_account; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER add_person_to_account
    AFTER INSERT OR UPDATE OF person_id ON PUBLIC.account FOR EACH ROW
EXECUTE FUNCTION PUBLIC.add_account_person_trigger_account();


--
-- Name: account audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.account FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: account_land audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.account_land FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: account_person audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.account_person FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: cctv audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.cctv FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: contact audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.contact FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.gate FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate_open audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.gate_open FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate_open_reason audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.gate_open_reason FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: land audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.land FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_discount audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.member_discount FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_payment audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.member_payment FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_rate audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.member_rate FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.person FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person_email audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.person_email FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person_phone audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.person_phone FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: personal_access_token audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.personal_access_token FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: refinance_rate audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.refinance_rate FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: street audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.street FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: target audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.target FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: target_payment audit_trigger_row; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_row
    AFTER INSERT OR DELETE OR UPDATE ON PUBLIC.target_payment FOR EACH ROW
EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: account audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.account FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: account_land audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.account_land FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: account_person audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.account_person FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: cctv audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.cctv FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: contact audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.contact FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.gate FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate_open audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.gate_open FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate_open_reason audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.gate_open_reason FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: land audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.land FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_discount audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.member_discount FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_payment audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.member_payment FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: member_rate audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.member_rate FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.person FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person_email audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.person_email FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: person_phone audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.person_phone FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: personal_access_token audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.personal_access_token FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: refinance_rate audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.refinance_rate FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: street audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.street FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: target audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.target FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: target_payment audit_trigger_stm; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER audit_trigger_stm
    AFTER TRUNCATE on PUBLIC.target_payment FOR EACH STATEMENT EXECUTE FUNCTION audit.if_modified_func('true');


--
-- Name: gate_open gate_open_find_person_id; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER gate_open_find_person_id
    BEFORE INSERT
    ON public.gate_open
    FOR EACH ROW EXECUTE function PUBLIC.gate_open_find_person_id();


--
-- Name: person_email gate_open_set_person_on_email; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER gate_open_set_person_on_email
    AFTER INSERT OR UPDATE OF email, person_id ON PUBLIC.person_email FOR EACH ROW
EXECUTE FUNCTION PUBLIC.gate_open_set_person_on_email();


--
-- Name: person_phone gate_open_set_person_on_phone; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER gate_open_set_person_on_phone
    AFTER INSERT OR UPDATE OF phone, person_id ON PUBLIC.person_phone FOR EACH ROW
EXECUTE FUNCTION PUBLIC.gate_open_set_person_on_phone();


--
-- Name: person gate_open_set_person_on_telegram_id; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER gate_open_set_person_on_telegram_id
    AFTER INSERT OR UPDATE OF telegram_id ON PUBLIC.person FOR EACH ROW
EXECUTE FUNCTION PUBLIC.gate_open_set_person_on_telegram_id();


--
-- Name: gate_open notify_hasura_gate_open_INSERT; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER "notify_hasura_gate_open_INSERT"
    AFTER INSERT
    ON public.gate_open
    FOR EACH ROW EXECUTE function hdb_catalog."notify_hasura_gate_open_INSERT"();


--
-- Name: member_payment set_account_balance; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_account_balance
    AFTER INSERT OR DELETE OR UPDATE OF amount, account_id ON PUBLIC.member_payment FOR EACH ROW
EXECUTE FUNCTION PUBLIC.account_trigger_balance();


--
-- Name: account set_person_balance; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_person_balance
    AFTER UPDATE OF balance
    ON public.account
    FOR EACH ROW EXECUTE function PUBLIC.person_balance_trigger_account();


--
-- Name: account_person set_person_balance; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_person_balance
    AFTER INSERT OR DELETE OR UPDATE OF account_id, person_id ON PUBLIC.account_person FOR EACH ROW
EXECUTE FUNCTION PUBLIC.person_balance_trigger_account_person();


--
-- Name: person_email set_person_email_is_main_to_false; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_person_email_is_main_to_false
    BEFORE INSERT OR UPDATE OF is_main ON PUBLIC.person_email FOR EACH ROW
EXECUTE FUNCTION PUBLIC.set_person_email_is_main_to_false();


--
-- Name: member_payment set_person_last_payment; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_person_last_payment
    AFTER INSERT OR DELETE OR UPDATE OF account_id, amount, paid_at ON PUBLIC.member_payment FOR EACH ROW
EXECUTE FUNCTION PUBLIC.person_last_paid_trigger_member_payment();


--
-- Name: person_phone set_person_phone_is_main_to_false; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_person_phone_is_main_to_false
    BEFORE INSERT OR UPDATE OF is_main ON PUBLIC.person_phone FOR EACH ROW
EXECUTE FUNCTION PUBLIC.set_person_phone_is_main_to_false();


--
-- Name: target_payment set_target_amount; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_target_amount
    AFTER INSERT OR UPDATE OF amount, target_id ON PUBLIC.target_payment FOR EACH ROW
EXECUTE FUNCTION PUBLIC.set_target_amount();


--
-- Name: account set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.account
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: account_land set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.account_land
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: account_person set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.account_person
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: cctv set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.cctv
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: contact set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.contact
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: contractor set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.contractor
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: gate set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.gate
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: gate_open set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.gate_open
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: gate_open_reason set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.gate_open_reason
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: land set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.land
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: member_discount set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.member_discount
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: member_payment set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.member_payment
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: member_rate set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.member_rate
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: person set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.person
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: person_email set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.person_email
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: person_phone set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.person_phone
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: personal_access_token set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.personal_access_token
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: refinance_rate set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.refinance_rate
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: street set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.street
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: target set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.target
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: target_payment set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.target_payment
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: users set_updated_at; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON public.users
    FOR EACH ROW EXECUTE function PUBLIC.set_current_timestamp_updated_at();


--
-- Name: member_payment update_balance; Type: TRIGGER; Schema: public; Owner: astra50
--

CREATE TRIGGER update_balance
    AFTER INSERT OR UPDATE OF amount, account_id, paid_at ON PUBLIC.member_payment FOR EACH ROW
EXECUTE FUNCTION PUBLIC.calculate_member_payment_balance();


--
-- Name: logged_actions logged_actions_user_id_fkey; Type: FK CONSTRAINT; Schema: audit; Owner: astra50
--

ALTER TABLE only audit.logged_actions
    ADD CONSTRAINT logged_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES PUBLIC.users(id);


--
-- Name: account_land account_land_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_land
    ADD CONSTRAINT account_land_account_id_fkey FOREIGN KEY (account_id) REFERENCES PUBLIC.account(id) ON
DELETE
CASCADE;


--
-- Name: account_land account_land_land_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_land
    ADD CONSTRAINT account_land_land_id_fkey FOREIGN KEY (land_id) REFERENCES PUBLIC.land(id);


--
-- Name: account_person account_person_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_person
    ADD CONSTRAINT account_person_account_id_fkey FOREIGN KEY (account_id) REFERENCES PUBLIC.account(id) ON
DELETE
CASCADE;


--
-- Name: account account_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account
    ADD CONSTRAINT account_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id);


--
-- Name: account_person account_person_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.account_person
    ADD CONSTRAINT account_person_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id) ON
DELETE
CASCADE;


--
-- Name: gate gate_cctv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate
    ADD CONSTRAINT gate_cctv_id_fkey FOREIGN KEY (cctv_id) REFERENCES PUBLIC.cctv(id) ON
UPDATE cascade
ON
DELETE
SET NULL;


--
-- Name: gate_open gate_open_gate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate_open
    ADD CONSTRAINT gate_open_gate_id_fkey FOREIGN KEY (gate_id) REFERENCES PUBLIC.gate(id);


--
-- Name: gate_open gate_open_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate_open
    ADD CONSTRAINT gate_open_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id);


--
-- Name: gate_open gate_open_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.gate_open
    ADD CONSTRAINT gate_open_reason_id_fkey FOREIGN KEY (reason_id) REFERENCES PUBLIC.gate_open_reason(id);


--
-- Name: land land_street_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.land
    ADD CONSTRAINT land_street_id_fkey FOREIGN KEY (street_id) REFERENCES PUBLIC.street(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: member_discount member_discount_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_discount
    ADD CONSTRAINT member_discount_account_id_fkey FOREIGN KEY (account_id) REFERENCES PUBLIC.account(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: member_discount member_discount_rate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_discount
    ADD CONSTRAINT member_discount_rate_id_fkey FOREIGN KEY (rate_id) REFERENCES PUBLIC.member_rate(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: member_payment member_payment_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_payment
    ADD CONSTRAINT member_payment_account_id_fkey FOREIGN KEY (account_id) REFERENCES PUBLIC.account(id);


--
-- Name: member_payment member_payment_land_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_payment
    ADD CONSTRAINT member_payment_land_id_fkey FOREIGN KEY (land_id) REFERENCES PUBLIC.land(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: member_payment member_payment_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_payment
    ADD CONSTRAINT member_payment_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: member_payment member_payment_rate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.member_payment
    ADD CONSTRAINT member_payment_rate_id_fkey FOREIGN KEY (rate_id) REFERENCES PUBLIC.member_rate(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: person_email person_email_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_email
    ADD CONSTRAINT person_email_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id);


--
-- Name: person_phone person_phone_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person_phone
    ADD CONSTRAINT person_phone_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id);


--
-- Name: person person_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.person
    ADD CONSTRAINT person_user_id_fkey FOREIGN KEY (user_id) REFERENCES PUBLIC.users(id) ON
UPDATE cascade
ON
DELETE
SET NULL;


--
-- Name: personal_access_token personal_access_token_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.personal_access_token
    ADD CONSTRAINT personal_access_token_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id) ON
UPDATE cascade
ON
DELETE CASCADE;


--
-- Name: target_payment target_payment_contractor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target_payment
    ADD CONSTRAINT target_payment_contractor_id_fkey FOREIGN KEY (contractor_id) REFERENCES PUBLIC.contractor(id);


--
-- Name: target_payment target_payment_land_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target_payment
    ADD CONSTRAINT target_payment_land_id_fkey FOREIGN KEY (land_id) REFERENCES PUBLIC.land(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: target_payment target_payment_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target_payment
    ADD CONSTRAINT target_payment_person_id_fkey FOREIGN KEY (person_id) REFERENCES PUBLIC.person(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- Name: target_payment target_payment_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: astra50
--

ALTER TABLE only PUBLIC.target_payment
    ADD CONSTRAINT target_payment_target_id_fkey FOREIGN KEY (target_id) REFERENCES PUBLIC.target(id) ON
UPDATE restrict
ON
DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

