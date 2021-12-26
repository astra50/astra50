import {Create, CreateProps, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать лицевой счёт"
        >
            <SimpleForm redirect="list">
                <TextInput source="number" label="Номер"/>
                <CommentInput/>
                <PersonReferenceInput validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default AccountCreate
