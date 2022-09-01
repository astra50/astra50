import {Edit, EditProps, FieldProps, NumberInput, SimpleForm, TextInput} from 'react-admin'
import {StreetReferenceInput} from '../street/StreetReference'
import {Land} from '../types'

const Title = (props: FieldProps<Land>) => {
    const {record} = props

    return <span>Участок {record ? `"${record.number}"` : ''}</span>
}

const LandEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <StreetReferenceInput/>
                <NumberInput source="number" label="Номер"/>
                <NumberInput source="square" label="Площадь"/>
                <TextInput source="cadastral_number" label="Кадастровый номер"/>
                <TextInput source="coordinates" label="Координаты"/>
            </SimpleForm>
        </Edit>
    )
}

export default LandEdit
