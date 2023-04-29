import {BooleanInput, Create, Identifier, RaRecord, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {PersonReferenceInput} from '../person/PersonReference'
import {PersonPhone} from '../types'

const PersonPhoneCreate = () => {
    return (
        <Create
            title="Создать телефон"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as PersonPhone

                return `person/${record.person_id}/show`
            }}
        >
            <SimpleForm>
                <PersonReferenceInput/>
                <TextInput source="phone" label="Телефон"/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default PersonPhoneCreate
