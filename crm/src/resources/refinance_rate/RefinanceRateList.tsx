import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    List,
    NumberField,
    SelectColumnsButton,
    TopToolbar,
} from 'react-admin'

const RefinanceRateActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <CreateButton/>
    </TopToolbar>
)

const RefinanceRateList = () =>
    <List
        actions={<RefinanceRateActions/>}
        title="Ставки рефинансирования"
        empty={false}
        sort={{field: 'since', order: 'DESC'}}
    >
        <DatagridConfigurable
            rowClick="edit"
            bulkActionButtons={false}
            omit={['updated_at']}
        >
            <NumberField source="rate" label="Ставка"/>
            <DateField source="since" label="Дата"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default RefinanceRateList
