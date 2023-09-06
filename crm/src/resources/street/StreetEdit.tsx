import {Edit, FieldProps, required, SimpleForm, TextInput} from 'react-admin'
import {Street} from '../../types'

const Title = (props: FieldProps<Street>) => {
    const {record} = props

    return <span>Улица {record ? `"${record.name}"` : ''}</span>
}

const StreetEdit = () => {
    return (
        <Edit
            title={<Title/>}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="name" validate={required()}/>
            </SimpleForm>
        </Edit>
    )
}

export default StreetEdit
