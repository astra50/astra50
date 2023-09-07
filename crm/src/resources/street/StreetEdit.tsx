import {Edit, required, SimpleForm, TextInput} from 'react-admin'

const StreetEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="name" validate={required()}/>
            </SimpleForm>
        </Edit>
    )
}

export default StreetEdit
