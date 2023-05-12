import {DateInput, Edit, FieldProps, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../components/comment'
import {PersonReferenceInput} from '../person/PersonReference'
import {Account} from '../types'

const Title = (props: FieldProps<Account>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountEdit = () => {
    return (
        <Edit
            title={<Title/>}
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
