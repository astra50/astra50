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
import {CommentField} from '../components/comment'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="name,comment" label="Поиск" alwaysOn/>,
]

const TargetActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const TargetList = () =>
    <List
        actions={<TargetActions/>}
        title="Цели"
        empty={false}
        filters={filters}
        sort={{field: 'created_at', order: 'desc'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <TextField source="name" label="Цель"/>
            <BooleanField source="is_public" label="Опубликовано"/>
            <CommentField/>
            <MoneyField source="total_amount" label="Целевая сумма"/>
            <MoneyField source="current_amount" label="Собрано"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default TargetList
