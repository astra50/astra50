import {Datagrid, DateField, List, ListProps, TextField} from 'react-admin'
import {MoneyField} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceField} from '../target/TargetReference'

const filters = [
    <PersonReferenceInput source="person_id"/>,
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
