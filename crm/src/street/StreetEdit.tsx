import {Edit, EditProps, FieldProps, SimpleForm, TextInput} from 'react-admin'
import {Street} from '../types'

const Title = (props: FieldProps<Street>) => {
    const {record} = props

    return <span>Улица {record ? `"${record.name}"` : ''}</span>
}

const StreetEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <TextInput source="name"/>
            </SimpleForm>
        </Edit>
    )
}

export default StreetEdit
