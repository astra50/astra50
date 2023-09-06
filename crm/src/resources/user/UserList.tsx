import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'

const filters = [
    <TextInput source="username" label="Поиск" alwaysOn/>,
]

const UserActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const UserList = () =>
    <List
        actions={<UserActions/>}
        title="Пользователи"
        empty={false}
        filters={filters}
        sort={{field: 'created_at', order: 'desc'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['updated_at']}
        >
            <TextField source="username"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default UserList
