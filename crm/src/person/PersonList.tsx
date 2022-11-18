import {Datagrid, List, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="firstname,lastname,middlename,phone,email,telegram_id" label="Поиск" alwaysOn/>,
]

const PersonList = () =>
    <List
          title={'Садоводы'}
          empty={false}
          filters={filters}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <TextField source="phone" label="Телефон"/>
            <TextField source="phone_second" label="Телефон2"/>
            <TextField source="email" label="E-mail"/>
            <MoneyField source="balance" label="Баланс"/>
            <TextField source="comment" label="Комментарий"/>
        </Datagrid>
    </List>

export default PersonList
