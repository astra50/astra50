import {BooleanField, Datagrid, List, TextField, TextInput} from 'react-admin'
import {CommentField} from '../components/comment'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="phone" label="Поиск" alwaysOn/>,
]

const PersonPhoneList = () =>
    <List
        title="Телефоны"
        empty={false}
        filters={filters}
        perPage={25}
    >
        <Datagrid
            rowClick={false}
        >
            <PersonReferenceField/>
            <TextField source="phone" label="Телефон"/>
            <BooleanField source="is_main" label="Основной?"/>
            <CommentField/>
        </Datagrid>
    </List>

export default PersonPhoneList
