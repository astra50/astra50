import {Edit, SimpleForm, TextInput} from 'react-admin'

const UserEdit = () => {
    return (
        <Edit
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="id" disabled/>
                <TextInput source="username" disabled/>
            </SimpleForm>
        </Edit>
    )
}

export default UserEdit
