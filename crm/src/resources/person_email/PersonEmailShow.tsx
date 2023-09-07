import {Email} from '@mui/icons-material'
import {Divider} from '@mui/material'
import {
    BooleanField,
    Button,
    DateField,
    EditButton,
    Show,
    SimpleShowLayout, TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
import {CommentField} from '../../components/comment'
import {EmailField} from '../../components/email'
import {PersonReferenceField} from '../person/PersonReference'

const PersonEmailShowActions = () => {
    const record = useRecordContext()

    if (!record) return <TopToolbar/>

    return (
        <TopToolbar>
            <Button href={'mailto:' + record.email} label="Письмо"><Email/></Button>
            <EditButton/>
        </TopToolbar>
    )
};

const PersonEmailShow = () => {
    return (
        <Show
            actions={<PersonEmailShowActions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <PersonReferenceField/>
                <EmailField/>
                <BooleanField source="is_main" label="Основной?"/>
                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonEmailShow
