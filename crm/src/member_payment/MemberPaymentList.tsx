import {BooleanInput, Datagrid, DateField, List, NumberField, TextField, TextInput} from 'react-admin'
import {AccountReferenceField, AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="account#number@_ilike,comment,account#persons#person#full_name@_ilike" label="Поиск"
               alwaysOn/>,
    <BooleanInput source="is_discount" label="Скидка"/>,
    <AccountReferenceInput source="account_id"/>,
    // <PersonReferenceInput source="person_id"/>,
]

const MemberPaymentList = () => {
    return (
        <List
            title="Членские взносы"
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}

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
