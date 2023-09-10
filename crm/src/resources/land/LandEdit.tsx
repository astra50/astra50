import {Edit, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {StreetReferenceInput} from '../street/StreetReference'

const LandEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <StreetReferenceInput validate={required()}/>
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
