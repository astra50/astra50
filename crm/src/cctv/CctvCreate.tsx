import {Create, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../components/comment'

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
                <TextInput source="url"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default CctvCreate
