import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CommentField} from '../components/comment'
import {GateReferenceField} from '../gate/GateReference'
import {GateOpenReasonReferenceField} from '../gate_open_reason/GateOpenReasonReference'
import {PersonReferenceField} from '../person/PersonReference'

const GateOpenShow = () => {
    return (
        <Show
            title="Открытие ворот"
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <GateReferenceField label="Ворота"/>
                <GateOpenReasonReferenceField label="Тип источника"/>
                <TextField source="source" label="Источник"/>
                <CommentField/>
                <PersonReferenceField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default GateOpenShow
