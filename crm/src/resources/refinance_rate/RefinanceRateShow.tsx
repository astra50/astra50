import {Divider} from '@mui/material'
import {DateField, NumberField, Show, SimpleShowLayout, TextField} from 'react-admin'

const PersonPhoneShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <NumberField source="rate" label="Ставка"/>
                <DateField source="since" label="Дата"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonPhoneShow
