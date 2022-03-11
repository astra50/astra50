import {DateInput, Edit, EditProps, FieldProps, NumberInput, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../comment'
import {PersonReferenceInput} from '../person/PersonReference'
import {Account} from '../types'

const Title = (props: FieldProps<Account>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <NumberInput source="number" label="Номер"/>
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
