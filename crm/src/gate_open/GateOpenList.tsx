import {Datagrid, DateField, FunctionField, List, TextField, TextInput} from 'react-admin'
import {GateReferenceField, GateReferenceInput} from '../gate/GateReference'
import {GateOpenReasonReferenceField, GateOpenReasonReferenceInput} from '../gate_open_reason/GateOpenReasonReference'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {GateOpen} from '../types'

const filters = [
    <TextInput source="source" label="Поиск" alwaysOn/>,
    <GateReferenceInput source="gate_id"/>,
    <GateOpenReasonReferenceInput source="reason_id" label="Тип источника" alwaysOn/>,
    <PersonReferenceInput source="person_id"/>,
]

const GateOpenList = () => {
    return (
        <List
            title="Журнал открытия ворот"
            sort={{field: 'created_at', order: 'DESC'}}
            filters={filters}
            perPage={25}
        >
            <Datagrid bulkActionButtons={false} rowClick="show">
                <GateReferenceField label="Ворота" link={false}/>
                <GateOpenReasonReferenceField label="Тип источника" link={false}/>
                <FunctionField label="Источник / Садовод" render={function (record: GateOpen) {
                    if (record.person_id) {
                        return <PersonReferenceField link={false}/>
                    }

                    return <TextField source="source" label="Источник"/>
                }}/>
                <DateField source="created_at" label="Дата" showTime={true}/>
            </Datagrid>
        </List>
    )
}

export default GateOpenList
