import {BooleanInput, Edit, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'

const CctvEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="url" fullWidth/>
                <TextInput source="preview" fullWidth/>
                <CommentInput/>
                <BooleanInput source="is_enabled" fullWidth/>
            </SimpleForm>
        </Edit>
    )
}

export default CctvEdit
