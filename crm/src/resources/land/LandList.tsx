import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    List,
    NumberField,
    Pagination,
    PaginationProps,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {StreetReferenceField, StreetReferenceInput} from '../street/StreetReference'

const filters = [
    <StreetReferenceInput source="street_id"/>,
    <TextInput source="number,cadastral_number" label="Поиск" alwaysOn/>,
]

const LandPagination = (props: PaginationProps) => <Pagination rowsPerPageOptions={[50, 100, 150]} {...props} />

const LandActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const LandList = () =>
    <List
        actions={<LandActions/>}
        empty={false}
        filters={filters}
        sort={{field: 'number_integer', order: 'ASC'}}
        pagination={<LandPagination/>}
        perPage={150}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <StreetReferenceField link={false}/>
            <NumberField source="number" label="Номер"/>
            <NumberField source="square" label="Площадь"/>
            <TextField source="cadastral_number" label="Кадастровый номер"/>

            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default LandList
