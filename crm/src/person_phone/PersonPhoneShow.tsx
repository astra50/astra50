import CallIcon from '@mui/icons-material/Call'
import {
    BooleanField,
    Button,
    EditButton,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
import {CommentField} from '../comment'
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
            title="Телефон"
            actions={<PersonPhoneShowActions/>}
        >
            <SimpleShowLayout>
                <PersonReferenceField/>
                <TextField source="phone" label="Телефон"/>
                <BooleanField source="is_main" label="Основной?"/>
                <CommentField/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonPhoneShow
