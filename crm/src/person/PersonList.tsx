import {Datagrid, DateField, List, TextField, TextInput} from 'react-admin'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="firstname,lastname,middlename,phones#phone@_ilike,emails#email@_ilike,telegram_id" label="Поиск" alwaysOn/>,
]

const PersonList = () =>
    <List
        title={'Садоводы'}
        empty={false}
        filters={filters}
        sort={{field: 'updated_at', order: 'desc'}}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <MoneyField source="balance" label="Баланс"/>

            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </Datagrid>
    </List>

export default PersonList
