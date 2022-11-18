import {BooleanField, Datagrid, List, ListProps, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="name,comment" label="Поиск" alwaysOn/>,
]

const TargetList = (props: ListProps) =>
    <List {...props}
          title="Цели"
          empty={false}
          filters={filters}
          sort={{field: "created_at", order: "desc"}}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="name" label="Цель"/>
            <BooleanField source="is_public" label="Опубликовано"/>
            <TextField source="comment" label="Комментарий"/>
            <MoneyField source="total_amount" label="Целевая сумма"/>
            <MoneyField source="current_amount" label="Собрано"/>
        </Datagrid>
    </List>

export default TargetList
