import React from 'react'
import {BooleanField, DateField, Show, SimpleShowLayout, TextField, TopToolbar} from 'react-admin'
import {JsonField} from '../../../components/JsonField'
import {UsersReferenceField} from '../../user/UserReference'

const AuditActions = () => {
    return (
        <TopToolbar>
        </TopToolbar>
    )
}

const AuditActionShow = () => {
    return (
        <Show
            actions={<AuditActions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <TextField source="schema_name"/>
                <TextField source="table_name"/>
                <TextField source="relid"/>
                <TextField source="session_user_name"/>
                <JsonField source="hasura_user"/>
                <UsersReferenceField/>
                <DateField source="action_tstamp_tx" showTime/>
                <DateField source="action_tstamp_stm" showTime/>
                <DateField source="action_tstamp_clk" showTime/>
                <TextField source="transaction_id"/>
                <TextField source="application_name"/>
                <TextField source="client_addr"/>
                <TextField source="client_port"/>
                <TextField source="client_query"/>
                <TextField source="action"/>
                <JsonField source="row_data"/>
                <JsonField source="changed_fields"/>
                <BooleanField source="statement_only"/>
            </SimpleShowLayout>
        </Show>
    )
}

export default AuditActionShow
