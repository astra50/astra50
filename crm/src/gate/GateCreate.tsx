import {Create, CreateProps, required, SimpleForm, TextInput} from 'react-admin'

const GateCreate = (props: CreateProps) => {
    return (
        <Create {...props}>
            <SimpleForm redirect="list">
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
            </SimpleForm>
        </Create>
    )
}

export default GateCreate
