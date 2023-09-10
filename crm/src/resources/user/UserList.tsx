import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List, ReferenceOneField,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'

const filters = [
    <TextInput source="username,person#full_name@_ilike" label="Поиск" alwaysOn/>,
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
        empty={false}
        filters={filters}
        sort={{field: 'created_at', order: 'DESC'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['updated_at']}
        >
            <TextField source="username"/>

            <ReferenceOneField target="user_id" reference="person" label="Садовод" link={false}>
                <TextField source="full_name"/>
            </ReferenceOneField>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default UserList
