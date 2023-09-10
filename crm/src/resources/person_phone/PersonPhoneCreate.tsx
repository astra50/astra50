import {BooleanInput, Create, Identifier, RaRecord, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {PersonPhone} from '../../types'
import person from '../person'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonPhoneCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as PersonPhone

                return `${person.name}/${record.person_id}/show`
            }}
        >
            <SimpleForm>
                <PersonReferenceInput validate={required()}/>
                <TextInput source="phone" label="Телефон" validate={required()}/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default PersonPhoneCreate
