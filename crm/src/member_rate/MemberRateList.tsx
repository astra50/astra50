import {Datagrid, DateField, List, ListProps, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="comment" label="Поиск" alwaysOn/>,
]

const MemberRateList = (props: ListProps) =>
    <List {...props}
          title="Ставки"
          empty={false}
          filters={filters}
          sort={{field: 'since', order: 'DESC'}}
    >
        <Datagrid
            rowClick="edit"
        >
            <MoneyField source="amount" label="Ставка"/>
            <TextField source="comment" label="Комментарий"/>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>
        </Datagrid>
    </List>

export default MemberRateList
