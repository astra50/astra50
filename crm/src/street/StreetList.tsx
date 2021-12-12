import {Datagrid, List, ListProps, TextField, TextInput} from 'react-admin'

const filters = [
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const StreetList = (props: ListProps) =>
    <List {...props}
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
