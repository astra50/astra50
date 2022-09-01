import {Create, CreateProps, NumberInput, SimpleForm, TextInput} from 'react-admin'
import {StreetReferenceInput} from '../street/StreetReference'

const LandCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать участок"
        >
            <SimpleForm redirect="list">
                <StreetReferenceInput/>
                <NumberInput source="number" label="Номер"/>
                <NumberInput source="square" label="Площадь"/>
                <TextInput source="cadastral_number" label="Кадастровый номер"/>
                <TextInput source="coordinates" label="Координаты"/>
            </SimpleForm>
        </Create>
    )
}

export default LandCreate
