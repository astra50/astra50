import {Datagrid, DateField, List, ListProps, Pagination, PaginationProps, ReferenceField, TextInput} from 'react-admin'
import {LandReferenceField} from '../land/LandReference'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'
import {StreetReferenceInput} from '../street/StreetReference'

const filters = [
    <StreetReferenceInput source="street_id"/>,
    <TextInput source="number,cadastral_number" label="Поиск" alwaysOn/>,
]

const LandOwnershipPagination = (props: PaginationProps) => <Pagination
    rowsPerPageOptions={[50, 100, 150, 200]} {...props} />

const LandOwnershipList = (props: ListProps) =>
    <List {...props}
          title="Владения"
          empty={false}
          filters={filters}
          sort={{field: 'land.number', order: 'ASC'}}
          pagination={<LandOwnershipPagination/>}
          perPage={150}
    >
        <Datagrid
            rowClick="edit"
        >
            <LandReferenceField/>
            <PersonReferenceField source="owner_id" label="Владелец"/>
            <ReferenceField source="owner_id" reference="person" label="Баланс" link={false}>
                <MoneyField source="balance"/>
            </ReferenceField>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>
        </Datagrid>
    </List>

export default LandOwnershipList
