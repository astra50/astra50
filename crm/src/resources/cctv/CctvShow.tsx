import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CommentField} from '../../components/comment'

const CctvShow = () => {
    return (
        <>
            <Show
                title="Ворота"
            >
                <SimpleShowLayout>
                    <TextField source="id"/>

                    <TextField source="name" label="Название"/>
                    <TextField source="url"/>
                    <TextField source="preview"/>
                    <CommentField/>

                    <Divider/>
                    <DateField source="created_at" label="Создан" showTime={true}/>
                    <DateField source="updated_at" label="Обновлён" showTime={true}/>
                </SimpleShowLayout>
            </Show>
        </>
    )
}

export default CctvShow
