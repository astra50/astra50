import {Create, DateInput, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountCreate = () => {
    return (
        <Create
                title="Создать лицевой счёт"
        >
            <SimpleForm redirect="list">
                <TextInput source="number" label="Номер"/>
                <CommentInput/>
                <PersonReferenceInput validate={required()}/>
                <DateInput
                    source="end_at"
                    label="Закрыт"
                    helperText="Дата завершения действия лицевого счёта"
                />
            </SimpleForm>
        </Create>
    )
}

export default AccountCreate
