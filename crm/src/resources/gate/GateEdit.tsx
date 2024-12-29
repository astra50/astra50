import {Edit, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {CctvReferenceInput} from '../cctv/CctvReference'

const GateEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
            redirect="show"
        >
            <SimpleForm>
                <NumberInput source="number" label="Номер"/>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
                <NumberInput
                    label="Задержка"
                    helperText="Задержка между открытиями"
                    source="delay"
                    validate={required()}
                />
                <TextInput source="coordinates" label="Координаты"/>
                <CctvReferenceInput/>
                <NumberInput source="cctv_preview_rate" label="Частота обновления превью видеокамеры"/>
                <TextInput source="ha_entity_id" label="HA Entity ID"/>
            </SimpleForm>
        </Edit>
    )
}

export default GateEdit
