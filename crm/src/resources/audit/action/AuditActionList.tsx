import {DatagridConfigurable, DateField, List, SelectField, SelectInput, TextField, TextInput} from 'react-admin'
import {UserReferenceField, UsersReferenceInput} from '../../user/UserReference'
import {AuditTableReferenceInput} from '../table/AuditTableReference'

const actionProps = {
    source: 'action',
    optionValue: 'id',
    optionText: 'name',
    choices: [
        {id: 'I', name: 'Insert'},
        {id: 'S', name: 'Select'},
        {id: 'U', name: 'Update'},
        {id: 'D', name: 'Delete'},
    ],
}
const filters = [
    <TextInput source="row_data#_cast#String@_ilike" label="Поиск" alwaysOn/>,
    <AuditTableReferenceInput source="table_name@_eq" alwaysOn/>,
    <UsersReferenceInput source="user_id"/>,
    <SelectInput {...actionProps}/>,
]

const AuditActionList = () =>
    <List
        empty={false}
        filters={filters}
        sort={{field: 'action_tstamp_tx', order: 'DESC'}}
        exporter={false}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
        >
            <SelectField {...actionProps}/>
            <TextField source="table_name"/>
            <UserReferenceField link={false}/>
            <DateField source="action_tstamp_tx" label="Дата" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default AuditActionList
