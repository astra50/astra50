import {Edit, EditProps, FieldProps, SimpleForm, TextInput} from 'react-admin'
import {CommentInput} from '../comment'
import {Contractor} from '../types'

const Title = (props: FieldProps<Contractor>) => {
    const {record} = props

    return <span>Контрагент {record ? `"${record.name}"` : ''}</span>
}

const ContractorEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <TextInput source="name"/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default ContractorEdit
