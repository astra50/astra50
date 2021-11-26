import {Datagrid, DateField, List, ListProps, TextField} from 'react-admin'
import {GateReferenceField} from '../gate/GateReference'
import {GateOpenReasonReferenceField} from '../gate_open_reason/GateOpenReasonReference'

const GateOpenList = (props: ListProps) => {
    return (
        <List
            title="Журнал открытия ворот"
            sort={{field: 'created_at', order: 'DESC'}}
            {...props}
        >
            <Datagrid rowClick="edit">
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
