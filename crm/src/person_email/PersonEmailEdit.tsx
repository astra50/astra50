import {BooleanInput, Edit, SimpleForm} from 'react-admin'
import {CommentInput} from '../comment'
import {EmailInput} from '../components/email'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonEmailEdit = () => {
    return (
        <Edit
            title="Электронный адрес"
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <PersonReferenceInput/>
                <EmailInput/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonEmailEdit
