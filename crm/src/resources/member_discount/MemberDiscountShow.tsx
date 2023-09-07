import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {CommentField} from '../../components/comment'
import {AccountReferenceField} from '../account/AccountReference'
import {MemberRateReferenceField} from '../member_rate/MemberRateReference'

const MemberPaymentShow = () => {
    return (
        <Show
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <MemberRateReferenceField/>
                <AccountReferenceField/>
                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default MemberPaymentShow
