import {BooleanInput, Edit, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {EmailInput} from '../../components/email'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonEmailEdit = () => {
    return (
        <Edit
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <PersonReferenceInput required/>
                <EmailInput required/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonEmailEdit
