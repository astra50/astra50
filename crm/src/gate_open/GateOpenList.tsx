import {Datagrid, DateField, List, TextField, TextInput} from 'react-admin'
import {GateReferenceField} from '../gate/GateReference'
import {GateOpenReasonReferenceField, GateOpenReasonReferenceInput} from '../gate_open_reason/GateOpenReasonReference'

const filters = [
    <TextInput source="source" label="Поиск" alwaysOn/>,
    <GateOpenReasonReferenceInput source="reason_id" label="Тип источника" alwaysOn/>,
]

const GateOpenList = () => {
    return (
        <List
            title="Журнал открытия ворот"
            sort={{field: 'created_at', order: 'DESC'}}
            filters={filters}
        >
            <Datagrid bulkActionButtons={false}>
                <GateReferenceField label="Ворота"/>
                <GateOpenReasonReferenceField label="Тип источника" link={false}/>
                <TextField
                    source="source"
                    label="Источник"
                />
                <DateField source="created_at" label="Дата" showTime={true}/>
            </Datagrid>
        </List>
    )
}

export default GateOpenList
