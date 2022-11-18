import {Datagrid, List, TextField, TextInput} from 'react-admin'

const filters = [
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const StreetList = () =>
    <List
          title="Улицы"
          empty={false}
          filters={filters}
    >
        <Datagrid
            rowClick="edit"
        >
            <TextField source="name" label="Название"/>
        </Datagrid>
    </List>

export default StreetList
