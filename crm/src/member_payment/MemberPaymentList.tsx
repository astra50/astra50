import {Datagrid, DateField, List, ListProps, NumberField, TextField, TextInput} from 'react-admin'
import {AccountReferenceField, AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="account#number@_ilike,comment,account#persons#person#full_name@_ilike" label="Поиск"
               alwaysOn/>,
    <AccountReferenceInput source="account_id"/>,
]

const MemberPaymentList = (props: ListProps) => {
    return (
        <List
            title="Членские взносы"
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}
            {...props}
        >
            <Datagrid rowClick="edit">
                <AccountReferenceField/>
                <PersonReferenceField label="Плательщик"/>
                <NumberField
                    source="amount"
                    label="Сумма"
                    options={{style: 'currency', currency: 'RUB'}}
                />
                <DateField source="paid_at" label="Дата"/>
                <TextField source="comment" label="Комментарий"/>
            </Datagrid>
        </List>
    )
}

export default MemberPaymentList
