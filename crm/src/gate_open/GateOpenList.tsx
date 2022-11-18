import {Datagrid, DateField, List, TextField} from 'react-admin'
import {GateReferenceField} from '../gate/GateReference'
import {GateOpenReasonReferenceField} from '../gate_open_reason/GateOpenReasonReference'

const GateOpenList = () => {
    return (
        <List
            title="Журнал открытия ворот"
            sort={{field: 'created_at', order: 'DESC'}}

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
