import {BooleanField, Datagrid, List, TextInput} from 'react-admin'
import {CommentField} from '../comment'
import {EmailField} from '../components/email'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="phone" label="Поиск" alwaysOn/>,
]

const PersonEmailList = () =>
    <List
        title="Электронные адреса"
        empty={false}
        filters={filters}
        perPage={25}
    >
        <Datagrid
            rowClick={false}
        >
            <PersonReferenceField/>
            <EmailField/>
            <BooleanField source="is_main" label="Основной?"/>
            <CommentField/>
        </Datagrid>
    </List>

export default PersonEmailList
