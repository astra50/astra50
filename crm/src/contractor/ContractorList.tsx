import {Datagrid, List, TextField, TextInput} from 'react-admin'
import {CommentField} from '../components/comment'

const filters = [
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const ContractorList = () =>
    <List
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
