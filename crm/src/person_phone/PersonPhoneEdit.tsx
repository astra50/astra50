import {BooleanInput, Edit, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../components/comment'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonPhoneEdit = () => {
    return (
        <Edit
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <PersonReferenceInput required/>
                <TextInput source="phone" label="Телефон" validate={required()}/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonPhoneEdit
