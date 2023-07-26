import {
    BooleanField,
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List,
    SelectColumnsButton,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {CommentField} from '../components/comment'
import {EmailField} from '../components/email'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="phone" label="Поиск" alwaysOn/>,
]

const PersonEmailActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const PersonEmailList = () =>
    <List
        actions={<PersonEmailActions/>}
        title="Электронные адреса"
        empty={false}
        filters={filters}
        perPage={25}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick={false}
            omit={['created_at', 'updated_at']}
        >
            <PersonReferenceField/>
            <EmailField/>
            <BooleanField source="is_main" label="Основной?"/>
            <CommentField/>
            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default PersonEmailList
