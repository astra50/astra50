CREATE OR REPLACE FUNCTION public.positional(tbl regclass, clm text, group_by text, order_by text) RETURNS void
    LANGUAGE plpgsql AS
$positional$
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
        CREATE OR REPLACE FUNCTION $$ || tbl || $$_$$ || clm || $$() RETURNS trigger
    LANGUAGE plpgsql
AS
$trigger$
DECLARE
    max integer;
BEGIN
    SELECT COALESCE(MAX($$ || clm || $$), 0) INTO max FROM $$ || tbl || $$;

    IF (tg_op = 'INSERT') THEN
        IF new.$$ || clm || $$ IS NULL OR new.$$ || clm || $$ <= 0 THEN
            new.$$ || clm || $$ = max + 1;
        ELSEIF (new.$$ || clm || $$ > max + 1) THEN
            new.$$ || clm || $$ = max + 1;
        END IF;
    ELSEIF (tg_op = 'UPDATE') THEN
        IF new.$$ || clm || $$ < 1 THEN
            new.$$ || clm || $$ = 1;
        ELSEIF new.$$ || clm || $$ > max AND old.$$ || clm || $$ = max THEN
            new.$$ || clm || $$ = max;
        END IF;

        IF (old.$$ || clm || $$ < new.$$ || clm || $$) THEN
            UPDATE $$ || tbl || $$
            SET $$ || clm || $$ = $$ || clm || $$ - 1
            WHERE $$ || clm || $$ <= new.$$ || clm || $$
              AND $$ || clm || $$ > old.$$ || clm || $$
              AND id <> new.id;
        ELSEIF (old.$$ || clm || $$ > new.$$ || clm || $$) THEN
            UPDATE $$ || tbl || $$
            SET $$ || clm || $$ = $$ || clm || $$ + 1
            WHERE $$ || clm || $$ >= new.$$ || clm || $$
              AND $$ || clm || $$ < old.$$ || clm || $$
              AND id <> new.id;
        END IF;
    END IF;

    RETURN new;
END;
$trigger$;
        $$;

    EXECUTE $$
CREATE TRIGGER $$ || clm || $$_positional
    BEFORE INSERT OR UPDATE OF $$ || clm || $$
    ON $$ || tbl || $$
    FOR EACH ROW
    WHEN (PG_TRIGGER_DEPTH() = 0)
EXECUTE FUNCTION $$ || tbl || $$_$$ || clm || $$()
;
        $$;
END ;
$positional$
;

CREATE OR REPLACE FUNCTION public.positional(tbl regclass, group_by text, order_by text) RETURNS void
    LANGUAGE plpgsql AS
$$
BEGIN
    PERFORM public.positional(tbl, 'position', $2, $3);
END;
$$;
