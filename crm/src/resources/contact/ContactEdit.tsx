import {BooleanInput, Edit, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'

const ContactEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
            redirect="show"
        >
            <SimpleForm>
                <TextInput source="name" label="Название" validate={required()}/>
                <TextInput source="description" label="Описание"/>
                <TextInput source="phone" label="Телефон"/>
                <TextInput source="site" label="Website"/>
                <CommentInput/>
                <BooleanInput source="is_public" label="Публичный?"/>
                <NumberInput source="position" label="Позиция"/>
            </SimpleForm>
        </Edit>
    )
}

export default ContactEdit
