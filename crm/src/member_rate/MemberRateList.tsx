import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List,
    NumberField,
    SelectColumnsButton,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {CommentField} from '../components/comment'
import {MoneyField} from '../money'

const filters = [
    <TextInput source="comment" label="Поиск" alwaysOn/>,
]

const MemberRateActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const MemberRateList = () =>
    <List
        actions={<MemberRateActions/>}
        title="Ставки"
        empty={false}
        filters={filters}
        sort={{field: 'since', order: 'DESC'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <MoneyField source="amount" label="Ставка"/>
            <NumberField source="discount" label="Скидка"/>
            <CommentField/>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default MemberRateList
