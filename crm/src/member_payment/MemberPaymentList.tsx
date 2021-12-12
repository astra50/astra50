import {Datagrid, DateField, List, ListProps, NumberField, TextField} from 'react-admin'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'

const filters = [
    <PersonReferenceInput source="person_id"/>,
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
                <PersonReferenceField/>
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
