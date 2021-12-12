import {Create, CreateProps, SimpleForm, TextInput} from 'react-admin'

const StreetCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать улицу"
        >
            <SimpleForm redirect="list">
                <TextInput source="name" label="Название"/>
            </SimpleForm>
        </Create>
    )
}

export default StreetCreate
