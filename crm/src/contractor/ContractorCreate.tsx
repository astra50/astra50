import {Create, CreateProps, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'

const ContractorCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать контрагента"
        >
            <SimpleForm redirect="list">
                <TextInput source="name" label="Название"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default ContractorCreate
