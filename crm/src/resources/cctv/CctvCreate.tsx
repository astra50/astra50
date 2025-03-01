import {BooleanInput, Create, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'

const CctvCreate = () => {
    return (
        <Create
            redirect="show"
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
        </Create>
    )
}

export default CctvCreate
