import {Divider} from '@mui/material'
import {BooleanField, DateField, Show, SimpleShowLayout, TextField} from 'react-admin'
import {AccountReferenceField} from '../account/AccountReference'
import {LandReferenceField} from '../land/LandReference'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'

const MemberPaymentShow = () => {
    return (
        <Show
            title="Членский взнос"
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <AccountReferenceField/>
                <PersonReferenceField label="Плательщик"/>
                <MoneyField/>
                <MoneyField source="balance" label="Баланс на дату платежа"/>
                <DateField source="paid_at" label="Дата платежа"/>
                <LandReferenceField/>
                <TextField source="rate" label="Ставка"/>
                <BooleanField source="is_regular" label="Регулярные начисления?"/>
                <BooleanField source="is_discount" label="Скидка?"/>
                <TextField source="comment" label="Комментарий"/>
                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default MemberPaymentShow
