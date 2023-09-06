import {Create, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'

const ContractorCreate = () => {
    return (
        <Create
            title="Создать контрагента"
            redirect="list"
        >
            <SimpleForm>
                <TextInput source="name" label="Название" validate={required()}/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default ContractorCreate
