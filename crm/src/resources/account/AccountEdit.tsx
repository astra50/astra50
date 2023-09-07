import {DateInput, Edit, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountEdit = () => {
    return (
        <Edit
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="number" label="Номер" validate={required()}/>
                <PersonReferenceInput required/>
                <DateInput
                    source="end_at"
                    label="Дата закрытия"
                    helperText="Дата завершения действия лицевого счёта"
                />
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountEdit
