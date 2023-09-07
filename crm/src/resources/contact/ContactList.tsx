import {
    BooleanField, BooleanInput,
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List,
    NumberField,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {CommentField} from '../../components/comment'

const filters = [
    <TextInput source="name,description,phone,site" label="Поиск" alwaysOn/>,
    <BooleanInput source="is_public" label="Публичный?"/>,
]

const ContactActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const ContactList = () =>
    <List
        actions={<ContactActions/>}
        empty={false}
        filters={filters}
        sort={{field: 'position', order: 'asc'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['id', 'created_at', 'updated_at']}
        >
            <TextField source="id"/>

            <TextField source="name" label="Название"/>
            <TextField source="description" label="Описание"/>
            <TextField source="phone" label="Телефон"/>
            <TextField source="site" label="Website"/>
            <CommentField/>
            <BooleanField source="is_public" label="Публичный?"/>
            <NumberField source="position" label="Позиция"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default ContactList
