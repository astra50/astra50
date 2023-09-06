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
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const StreetActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const StreetList = () =>
    <List
        actions={<StreetActions/>}
        title="Улицы"
        empty={false}
        filters={filters}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="edit"
            omit={['created_at', 'updated_at']}
        >
            <TextField source="name" label="Название"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default StreetList
