import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CommentField} from '../../components/comment'

const ContactShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <TextField source="name" label="Название"/>
                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default ContactShow
