import {BooleanInput, Create, Identifier, RaRecord, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {EmailInput} from '../../components/email'
import {PersonEmail} from '../../types'
import person from '../person'
import {PersonReferenceInput} from '../person/PersonReference'

const PersonEmailCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as PersonEmail

                return `${person.name}/${record.person_id}/show`
            }}
        >
            <SimpleForm>
                <PersonReferenceInput validate={required()}/>
                <EmailInput validate={required()}/>
                <BooleanInput source="is_main" label="Основной?"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default PersonEmailCreate
