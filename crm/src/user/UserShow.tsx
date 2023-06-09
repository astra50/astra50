import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField} from 'react-admin'

const UserShow = () => {
    return (
        <Show
            title="Пользователь"
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <TextField source="username"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default UserShow
