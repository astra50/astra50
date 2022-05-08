CREATE OR REPLACE FUNCTION public.open_gate_site(gate text) RETURNS setof gate_open AS
$$
DECLARE
    session_variables jsonb;
BEGIN
    session_variables := CURRENT_SETTING('hasura.user', 't');

    RETURN QUERY WITH inserted_row AS (INSERT INTO public.gate_open (gate_id, reason_id, source) VALUES (gate::uuid,
                                                                                                         'site',
                                                                                                         session_variables ->>
                                                                                                         'x-hasura-user-id') RETURNING *)
               SELECT *
                 FROM inserted_row;

END
$$ LANGUAGE plpgsql;
