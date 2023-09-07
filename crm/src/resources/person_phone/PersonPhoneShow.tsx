import CallIcon from '@mui/icons-material/Call'
import {Divider} from '@mui/material'
import {
    BooleanField,
    Button, DateField,
    EditButton,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
import {CommentField} from '../../components/comment'
import {PersonReferenceField} from '../person/PersonReference'

const PersonPhoneShowActions = () => {
    const record = useRecordContext()

    if (!record) return <TopToolbar/>

    return (
        <TopToolbar>
            <Button href={'tel:' + record.phone} label="Звонок"><CallIcon/></Button>
            <EditButton/>
        </TopToolbar>
    )
};

const PersonPhoneShow = () => {
    return (
        <Show
            actions={<PersonPhoneShowActions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <PersonReferenceField/>
                <TextField source="phone" label="Телефон"/>
                <BooleanField source="is_main" label="Основной?"/>
                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonPhoneShow
