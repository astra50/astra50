import {
    BooleanField,
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
import {CommentField} from '../../components/comment'
import {PersonReferenceField} from '../person/PersonReference'

const filters = [
    <TextInput source="phone" label="Поиск" alwaysOn/>,
]

const PersonPhoneActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const PersonPhoneList = () =>
    <List
        actions={<PersonPhoneActions/>}
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
            <TextField source="phone" label="Телефон"/>
            <BooleanField source="is_main" label="Основной?"/>
            <CommentField/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default PersonPhoneList
