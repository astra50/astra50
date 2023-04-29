import {Edit, FieldProps, SimpleForm, TextInput} from 'react-admin'
import {Street} from '../types'

const Title = (props: FieldProps<Street>) => {
    const {record} = props

    return <span>Улица {record ? `"${record.name}"` : ''}</span>
}

const StreetEdit = () => {
    return (
        <Edit
            title={<Title/>}
        >
            <SimpleForm>
                <TextInput source="name"/>
            </SimpleForm>
        </Edit>
    )
}

export default StreetEdit
