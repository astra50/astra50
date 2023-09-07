import {Edit, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../../components/comment'

const ContractorEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="name" label="Название" validate={required()}/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default ContractorEdit
