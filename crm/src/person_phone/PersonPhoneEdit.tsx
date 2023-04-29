import {BooleanInput, Edit, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonPhoneEdit = () => {
    return (
        <Edit
            redirect="show"
        >
            <SimpleForm>
                <PersonReferenceInput/>
                <TextInput source="phone" label="Телефон"/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonPhoneEdit
