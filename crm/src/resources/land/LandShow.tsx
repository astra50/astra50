import {Divider} from '@mui/material'
import {DateField, NumberField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {StreetReferenceField} from '../street/StreetReference'

const ContactShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <StreetReferenceField/>
                <NumberField source="number" label="Номер"/>
                <NumberField source="square" label="Площадь"/>
                <TextField source="cadastral_number" label="Кадастровый номер"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default ContactShow
