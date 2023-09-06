import {Edit, FieldProps, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {StreetReferenceInput} from '../street/StreetReference'
import {Land} from '../../types'

const Title = (props: FieldProps<Land>) => {
    const {record} = props

    return <span>Участок {record ? `"${record.number}"` : ''}</span>
}

const LandEdit = () => {
    return (
        <Edit
            title={<Title/>}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <StreetReferenceInput required/>
                <NumberInput source="number" label="Номер"/>
                <NumberInput source="square" label="Площадь" validate={required()}/>
                <TextInput source="cadastral_number" label="Кадастровый номер"/>
                <TextInput source="coordinates" label="Координаты"/>
                <TextInput source="polygon" label="Геометрия" fullWidth/>
            </SimpleForm>
        </Edit>
    )
}

export default LandEdit
