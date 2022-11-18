import {Create, NumberInput, SimpleForm, TextInput} from 'react-admin'
import {StreetReferenceInput} from '../street/StreetReference'

const LandCreate = () => {
    return (
        <Create
                title="Создать участок"
        >
            <SimpleForm redirect="list">
                <StreetReferenceInput/>
                <NumberInput source="number" label="Номер"/>
                <NumberInput source="square" label="Площадь"/>
                <TextInput source="cadastral_number" label="Кадастровый номер"/>
                <TextInput source="coordinates" label="Координаты"/>
                <TextInput source="polygon" label="Геометрия" fullWidth/>
            </SimpleForm>
        </Create>
    )
}

export default LandCreate
