import {Datagrid, List, ListProps, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="name,comment" label="Поиск" alwaysOn/>,
]

const TargetList = (props: ListProps) =>
    <List {...props}
          title="Цели"
          empty={false}
          filters={filters}
    >
        <Datagrid
            rowClick="edit"
        >
            <TextField source="name" label="Цель"/>
            <TextField source="comment" label="Комментарий"/>
            <MoneyField source="total_amount" label="Целевая сумма"/>
            <MoneyField source="current_amount" label="Собрано"/>
        </Datagrid>
    </List>

export default TargetList
