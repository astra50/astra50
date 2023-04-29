import {BooleanInput, Create, Identifier, RaRecord, SimpleForm} from 'react-admin'
import {CommentInput} from '../comment'
import {EmailInput} from '../components/email'
import {PersonReferenceInput} from '../person/PersonReference'
import {PersonEmail} from '../types'

const PersonEmailCreate = () => {
    return (
        <Create
            title="Создать e-mail"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as PersonEmail

                return `person/${record.person_id}/show`
            }}
        >
            <SimpleForm>
                <PersonReferenceInput/>
                <EmailInput/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default PersonEmailCreate