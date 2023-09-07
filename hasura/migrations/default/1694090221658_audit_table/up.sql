CREATE VIEW audit.table
AS
SELECT DISTINCT a.table_name AS id
  FROM audit.logged_actions a;

ALTER TABLE audit.logged_actions ADD COLUMN user_id uuid
    REFERENCES public.users (id);
UPDATE audit.logged_actions
   SET user_id = (hasura_user ->> 'x-hasura-user-id')::uuid
 WHERE logged_actions.user_id IS NULL;

CREATE OR REPLACE FUNCTION audit.if_modified_func() RETURNS trigger
    SECURITY DEFINER SET search_path = pg_catalog, public
    LANGUAGE plpgsql AS
$$
DECLARE
    hasura        jsonb;
    audit_row     audit.logged_actions;
    excluded_cols text[] = ARRAY []::text[];
    new_r         jsonb;
    old_r         jsonb;
BEGIN
    IF tg_when <> 'AFTER' THEN RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger'; END IF;

    hasura := CURRENT_SETTING('hasura.user', 't')::jsonb;

    audit_row = ROW (NEXTVAL('audit.logged_actions_event_id_seq'), -- event_id
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

    IF NOT tg_argv[0]::boolean IS DISTINCT FROM 'f'::boolean THEN audit_row.client_query = NULL; END IF;

    IF tg_argv[1] IS NOT NULL THEN excluded_cols = tg_argv[1]::text[]; END IF;

    IF (tg_op = 'UPDATE' AND tg_level = 'ROW') THEN
        old_r = TO_JSONB(old);
        new_r = TO_JSONB(new);
        audit_row.row_data = old_r - excluded_cols;
        SELECT JSONB_OBJECT_AGG(new_t.key, new_t.value) - excluded_cols
          INTO audit_row.changed_fields
          FROM JSONB_EACH(old_r) AS old_t
                   JOIN JSONB_EACH(new_r) AS new_t
                   ON (old_t.key = new_t.key AND old_t.value <> new_t.value);
    ELSIF (tg_op = 'DELETE' AND tg_level = 'ROW') THEN
        audit_row.row_data = TO_JSONB(old) - excluded_cols;
    ELSIF (tg_op = 'INSERT' AND tg_level = 'ROW') THEN
        audit_row.row_data = TO_JSONB(new) - excluded_cols;
    ELSIF (tg_level = 'STATEMENT' AND tg_op IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE')) THEN
        audit_row.statement_only = 't';
    ELSE
        RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',tg_op, tg_level;
        RETURN NULL;
    END IF;
    INSERT INTO audit.logged_actions VALUES (audit_row.*);
    RETURN NULL;
END;
$$;
