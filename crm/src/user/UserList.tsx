import {Datagrid, DateField, List, TextField, TextInput} from 'react-admin'

const filters = [
    <TextInput source="username" label="Поиск" alwaysOn/>,
]

const UserList = () =>
    <List
        title="Пользователи"
        empty={false}
        filters={filters}
        sort={{field: 'created_at', order: 'desc'}}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="username"/>
            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </Datagrid>
    </List>

export default UserList
