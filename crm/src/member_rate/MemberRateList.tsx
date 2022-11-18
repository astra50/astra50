import {Datagrid, DateField, List, NumberField, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="comment" label="Поиск" alwaysOn/>,
]

const MemberRateList = () =>
    <List
          title="Ставки"
          empty={false}
          filters={filters}
          sort={{field: 'since', order: 'DESC'}}
    >
        <Datagrid
            rowClick="show"
        >
            <MoneyField source="amount" label="Ставка"/>
            <NumberField source="discount" label="Скидка"/>
            <TextField source="comment" label="Комментарий"/>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>
        </Datagrid>
    </List>

export default MemberRateList
