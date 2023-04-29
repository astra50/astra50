import {Email} from '@mui/icons-material'
import {BooleanField, Button, EditButton, Show, SimpleShowLayout, TopToolbar, useRecordContext} from 'react-admin'
import {CommentField} from '../comment'
import {EmailField} from '../components/email'
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
            title="Электронный адрес"
            actions={<PersonEmailShowActions/>}
        >
            <SimpleShowLayout>
                <PersonReferenceField/>
                <EmailField/>
                <BooleanField source="is_main" label="Основной?"/>
                <CommentField/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonEmailShow
