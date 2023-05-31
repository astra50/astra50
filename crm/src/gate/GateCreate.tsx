import {Create, NumberInput, required, SimpleForm, TextInput} from 'react-admin'

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
            </SimpleForm>
        </Create>
    )
}

export default GateCreate
