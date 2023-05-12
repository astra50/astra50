import {Edit, FieldProps, required, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {Contractor} from '../types'

const Title = (props: FieldProps<Contractor>) => {
    const {record} = props

    return <span>Контрагент {record ? `"${record.name}"` : ''}</span>
}

const ContractorEdit = () => {
    return (
        <Edit
            title={<Title/>}
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
