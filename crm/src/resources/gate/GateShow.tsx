import {Divider} from '@mui/material'
import {DateField, NumberField, ReferenceManyField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CctvReferenceField} from '../cctv/CctvReference'
import {GateOpenListDatagrid} from '../gate_open/GateOpenListDatagrid'

const GateShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <TextField source="name" label="Название"/>
                <NumberField source="number" label="Номер"/>
                <TextField source="phone" label="Телефон"/>
                <NumberField source="delay" label="Задержка между открытиями"/>
                <TextField source="coordinates" label="Координаты"/>
                <CctvReferenceField/>
                <NumberField source="cctv_preview_rate" label="Частота обновления превью видеокамеры"/>
                <TextField source="ha_entity_id" label="HA Entity ID"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>

                <Divider>Последние 15 открытий</Divider>
                <ReferenceManyField
                    reference="gate_open"
                    target="gate_id"
                    label={false}
                    perPage={15}
                    sort={{field: 'created_at', order: 'DESC'}}
                >
                    <GateOpenListDatagrid/>
                </ReferenceManyField>
            </SimpleShowLayout>
        </Show>
    )
}

export default GateShow
