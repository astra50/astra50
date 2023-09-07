import {Divider} from '@mui/material'
import {DateField, ReferenceOneField, Show, SimpleShowLayout, TextField} from 'react-admin'

const UserShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <TextField source="username"/>

                <Divider/>
                <ReferenceOneField target="user_id" reference="person" label="Садовод" link="show">
                    <TextField source="full_name"/>
                </ReferenceOneField>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default UserShow
