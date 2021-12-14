SELECT audit.audit_table('public.gate');
SELECT audit.audit_table('public.gate_open');
SELECT audit.audit_table('public.gate_open_reason');

CREATE FUNCTION audit.audit_table_drop(target_table regclass) RETURNS void AS
$$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger AS
$$
DECLARE
    _new record;
BEGIN
    _new := new;
    _new.updated_at = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.set_current_timestamp_updated_at() IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE FUNCTION public.timestampable(target_table regclass) RETURNS void AS
$$
BEGIN
    EXECUTE 'ALTER TABLE ' || target_table || ' ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT NOW()';
    EXECUTE 'ALTER TABLE ' || target_table || ' ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT NOW()';

    EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON ' || target_table ||
            ' FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at()';
END ;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.timestampable_drop(target_table regclass) RETURNS void AS
$$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS set_updated_at ON ' || target_table;
    EXECUTE 'ALTER TABLE ' || target_table || ' DROP COLUMN created_at';
    EXECUTE 'ALTER TABLE ' || target_table || ' DROP COLUMN updated_at';
END ;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.add_updated_at(target_table regclass) RETURNS void AS
$$
BEGIN
    EXECUTE 'ALTER TABLE ' || target_table || ' ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT NOW()';

    EXECUTE 'UPDATE ' || target_table || ' t
   SET updated_at = audit.at
  FROM (SELECT MAX(action_tstamp_clk) AS AT, row_data ->> ''id'' AS id
          FROM audit.logged_actions
         GROUP BY row_data ->> ''id'') audit
 WHERE t.id::text = audit.id
';

    EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON ' || target_table ||
            ' FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at()';
END ;
$$ LANGUAGE plpgsql;

ALTER TABLE public.gate ADD COLUMN created_at timestamptz NOT NULL DEFAULT NOW();
ALTER TABLE public.gate_open_reason ADD COLUMN created_at timestamptz NOT NULL DEFAULT NOW();

SELECT public.add_updated_at('public.gate');
SELECT public.add_updated_at('public.gate_open');
SELECT public.add_updated_at('public.gate_open_reason');
SELECT public.add_updated_at('public.land');
SELECT public.add_updated_at('public.land_ownership');
SELECT public.add_updated_at('public.member_payment');
SELECT public.add_updated_at('public.member_rate');
SELECT public.add_updated_at('public.person');
SELECT public.add_updated_at('public.street');
SELECT public.add_updated_at('public.target');
SELECT public.add_updated_at('public.target_payment');

DROP FUNCTION public.add_updated_at(regclass);
