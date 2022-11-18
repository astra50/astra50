import {DateInput, Edit, FieldProps, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
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
        >
            <SimpleForm>
                <TextInput source="number" label="Номер"/>
                <CommentInput/>
                <PersonReferenceInput validate={required()}/>
                <DateInput
                    source="end_at"
                    label="Закрыт"
                    helperText="Дата завершения действия лицевого счёта"
                />
            </SimpleForm>
        </Edit>
    )
}

export default AccountEdit
