import {Datagrid, DateField, DateInput, List, TextField, TextInput, WithRecord} from 'react-admin'
import {ContractorReferenceField} from '../contractor/ContractorReference'
import {LandReferenceField} from '../land/LandReference'
import {MoneyField} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceField, TargetReferenceInput} from '../target/TargetReference'

const filters = [
    <TargetReferenceInput source="target_id" alwaysOn/>,
    <TextInput source="person#full_name@_ilike,comment" label="Поиск"/>,
    <PersonReferenceInput source="person_id"/>,
    <DateInput source="paid_at" label="Дата"/>,
]

const TargetPaymentList = () => {
    return (
        <List
            title="Целевые взносы"
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}

        >
            <Datagrid rowClick="edit">
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
                <TextField source="comment" label="Комментарий"/>
            </Datagrid>
        </List>
    )
}

export default TargetPaymentList
