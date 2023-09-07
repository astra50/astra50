import {DatagridConfigurable, DateField, FunctionField, TextField} from 'react-admin'
import {GateReferenceField} from '../gate/GateReference'
import {GateOpenReasonReferenceField} from '../gate_open_reason/GateOpenReasonReference'
import {PersonReferenceField} from '../person/PersonReference'
import {GateOpen} from '../../types'

export const GateOpenListDatagrid = () =>
    <DatagridConfigurable
        bulkActionButtons={false}
        rowClick="show"
        omit={['updated_at']}
    >
        <GateReferenceField label="Ворота" link={false}/>
        <GateOpenReasonReferenceField link={false}/>
        <FunctionField label="Источник / Садовод" render={function (record: GateOpen) {
            if (record.person_id) {
                return <PersonReferenceField link={false}/>
            }

            return <TextField source="source" label="Источник"/>
        }}/>
        <DateField source="created_at" label="Дата" showTime={true}/>
        <DateField source="updated_at" label="Обновлён" showTime={true}/>
    </DatagridConfigurable>
