import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    FilterButton,
    FunctionField,
    List,
    ReferenceField,
    ReferenceManyField,
    SelectColumnsButton,
    SingleFieldList,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {MoneyField} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {Account} from '../types'

const filters = [
    <TextInput
        source="number,person#lastname@_ilike,person#firstname@_ilike,person#middlename@_ilike,person#phones#phone@_ilike,person#emails#email@_ilike,lands#land#number@_ilike"
        label="Поиск" alwaysOn/>,
    <PersonReferenceInput source="person_id"/>,
]

const AccountActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const AccountList = () =>
    <List
        actions={<AccountActions/>}
        title="Лицевые счета"
        empty={false}
        filters={filters}
        sort={{field: 'balance', order: 'ASC'}}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick="show"
            omit={['created_at', 'updated_at']}
        >
            <TextField source="number" label="Номер"/>
            <PersonReferenceField link={false}/>
            <ReferenceManyField label="Участки" reference="account_land" target="account_id" sortable={false}>
                <SingleFieldList linkType={false}>
                    <ReferenceField reference="land" source="land_id" link={false}>
                        <FunctionField render={(record: Account) => {
                            return <div>{record.number}&nbsp;</div>
                        }}/>
                    </ReferenceField>
                </SingleFieldList>
            </ReferenceManyField>
            <MoneyField source="balance" label="Баланс"/>
            <DateField source="created_at" label="Создан" showTime={true}/>
            <DateField source="updated_at" label="Обновлён" showTime={true}/>
        </DatagridConfigurable>
    </List>

export default AccountList
