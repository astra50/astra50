import {Datagrid, DateField, DateInput, List, ListProps, TextField, TextInput} from 'react-admin'
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

const TargetPaymentList = (props: ListProps) => {
    return (
        <List
            title="Целевые взносы"
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}
            {...props}
        >
            <Datagrid rowClick="edit">
                <TargetReferenceField/>
                <PersonReferenceField label="Плательщик"/>
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
