import {BooleanInput, Create, Identifier, RaRecord, SimpleForm} from 'react-admin'
import {CommentInput} from '../components/comment'
import {EmailInput} from '../components/email'
import person from '../person'
import {PersonReferenceInput} from '../person/PersonReference'
import {PersonEmail} from '../types'

const PersonEmailCreate = () => {
    return (
        <Create
            title="Создать e-mail"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as PersonEmail

                return `${person.name}/${record.person_id}/show`
            }}
        >
            <SimpleForm>
                <PersonReferenceInput required/>
                <EmailInput required/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default PersonEmailCreate
