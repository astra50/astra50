import {Datagrid, List, ListProps, TextField, TextInput} from 'react-admin'
import {CommentField} from '../comment'

const filters = [
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const ContractorList = (props: ListProps) =>
    <List {...props}
          title="Контрагенты"
          empty={false}
          filters={filters}
    >
        <Datagrid
            rowClick="edit"
        >
            <TextField source="name" label="Название"/>
            <CommentField/>
        </Datagrid>
    </List>

export default ContractorList
