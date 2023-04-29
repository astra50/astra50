import {
    ChipField,
    Datagrid,
    List,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    TextField,
    TextInput,
} from 'react-admin'
import {MoneyField} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'

const filters = [
    <TextInput
        source="number,person#lastname@_ilike,person#firstname@_ilike,person#middlename@_ilike,person#phone@_ilike,lands#land#number@_ilike"
        label="Поиск" alwaysOn/>,
    <PersonReferenceInput source="person_id"/>,
]

const AccountList = () =>
    <List
        title="Лицевые счета"
        empty={false}
        filters={filters}
        sort={{field: 'updated_at', order: 'DESC'}}
        perPage={10}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="number" label="Номер"/>
            <PersonReferenceField/>
            <ReferenceManyField label="Участки" reference="account_land" target="account_id" sortable={false}>
                <SingleFieldList linkType={false}>
                    <ReferenceField reference="land" source="land_id" link={false}>
                        <ChipField source="number"/>
                    </ReferenceField>
                </SingleFieldList>
            </ReferenceManyField>
            <MoneyField source="balance" label="Баланс"/>
        </Datagrid>
    </List>

export default AccountList
