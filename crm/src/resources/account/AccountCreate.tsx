import {Create, DateInput, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountCreate = () => {
    return (
        <Create
            redirect="show"
        >
            <SimpleForm>
                <TextInput source="number" label="Номер" validate={required()}/>
                <PersonReferenceInput validate={required()}/>
                <DateInput
                    source="end_at"
                    label="Дата закрытия"
                    helperText="Дата завершения действия лицевого счёта"
                />
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default AccountCreate
