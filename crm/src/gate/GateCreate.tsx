import {Create, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {CctvReferenceInput} from '../cctv/CctvReference'

const GateCreate = () => {
    return (
        <Create
            redirect="list"
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
            </SimpleForm>
        </Create>
    )
}

export default GateCreate
