import {Create, SimpleForm, TextInput} from 'react-admin'

const StreetCreate = () => {
    return (
        <Create
            title="Создать улицу"
            redirect="list"
        >
            <SimpleForm>
                <TextInput source="name" label="Название"/>
            </SimpleForm>
        </Create>
    )
}

export default StreetCreate
