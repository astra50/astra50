import {Divider} from '@mui/material'
import {BooleanField, DateField, NumberField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CommentField} from '../../components/comment'

const ContactShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <TextField source="name" label="Название"/>
                <TextField source="description" label="Описание"/>
                <TextField source="phone" label="Телефон"/>
                <TextField source="site" label="Website"/>
                <CommentField/>
                <BooleanField source="is_public" label="Публичный?"/>
                <NumberField source="position" label="Позиция"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default ContactShow
