import {Edit, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../components/comment'

const CctvEdit = () => {
    return (
        <Edit
            title="Видеокамера"
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
            </SimpleForm>
        </Edit>
    )
}

export default CctvEdit
