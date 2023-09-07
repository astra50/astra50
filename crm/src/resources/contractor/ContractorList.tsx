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
import {CommentField} from '../../components/comment'

const filters = [
    <TextInput source="name" label="Поиск" alwaysOn/>,
]

const ContractorActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const ContractorList = () =>
    <List
        actions={<ContractorActions/>}
        empty={false}
        filters={filters}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <TextField source="name" label="Название"/>
            <CommentField/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default ContractorList
