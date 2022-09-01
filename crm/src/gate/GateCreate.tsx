import {Create, CreateProps, NumberInput, required, SimpleForm, TextInput} from 'react-admin'

const GateCreate = (props: CreateProps) => {
    return (
        <Create {...props}>
            <SimpleForm redirect="list">
                <NumberInput source="number" label="Номер"/>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
                <TextInput source="coordinates" label="Координаты"/>
            </SimpleForm>
        </Create>
    )
}

export default GateCreate
