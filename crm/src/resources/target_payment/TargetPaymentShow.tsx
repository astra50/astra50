import {Divider} from '@mui/material'
import {DateField, Show, SimpleShowLayout, TextField, WithRecord} from 'react-admin'
import {CommentField} from '../../components/comment'
import {ContractorReferenceField} from '../contractor/ContractorReference'
import {LandReferenceField} from '../land/LandReference'
import {MoneyField} from '../../components/money'
import {PersonReferenceField} from '../person/PersonReference'
import {TargetReferenceField} from '../target/TargetReference'

const TargetPaymentShow = () => {
    return (
        <Show
            title="Целевой взнос"
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <TargetReferenceField/>
                <WithRecord label="Плательщик / Контрагент" render={record => {
                    if (record.person_id) return <PersonReferenceField/>

                    return <ContractorReferenceField/>
                }}/>
                <LandReferenceField/>
                <MoneyField
                    source="amount"
                    label="Сумма"
                />
                <DateField source="paid_at" label="Дата"/>
                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default TargetPaymentShow
