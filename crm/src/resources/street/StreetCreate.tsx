import {Create, required, SimpleForm, TextInput} from 'react-admin'

const StreetCreate = () => {
    return (
        <Create
            redirect="list"
        >
            <SimpleForm>
                <TextInput source="name" label="Название" validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default StreetCreate
