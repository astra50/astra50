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
import {MoneyField} from '../../components/money'

const filters = [
    <TextInput source="firstname,lastname,middlename,phones#phone@_ilike,emails#email@_ilike,telegram_id" label="Поиск"
               alwaysOn/>,
]

const PersonActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const PersonList = () =>
    <List
        actions={<PersonActions/>}
        empty={false}
        filters={filters}
        sort={{field: 'updated_at', order: 'desc'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <MoneyField source="balance" label="Баланс"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default PersonList
