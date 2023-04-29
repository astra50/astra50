import {Datagrid, List, NumberField, Pagination, PaginationProps, TextField, TextInput} from 'react-admin'
import {StreetReferenceField, StreetReferenceInput} from '../street/StreetReference'

const filters = [
    <StreetReferenceInput source="street_id"/>,
    <TextInput source="number,cadastral_number" label="Поиск" alwaysOn/>,
]

const LandPagination = (props: PaginationProps) => <Pagination rowsPerPageOptions={[50, 100, 150]} {...props} />

const LandList = () =>
    <List
        title="Участки"
        empty={false}
        filters={filters}
        sort={{field: 'number_integer', order: 'ASC'}}
        pagination={<LandPagination/>}
        perPage={150}
    >
        <Datagrid
            rowClick="edit"
        >
            <StreetReferenceField/>
            <NumberField source="number" label="Номер"/>
            <NumberField source="square" label="Площадь"/>
            <TextField source="cadastral_number" label="Кадастровый номер"/>
        </Datagrid>
    </List>

export default LandList
