import {Create, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'

const ContractorCreate = () => {
    return (
        <Create
            title="Создать контрагента"
            redirect="list"
        >
            <SimpleForm>
                <TextInput source="name" label="Название"/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default ContractorCreate
