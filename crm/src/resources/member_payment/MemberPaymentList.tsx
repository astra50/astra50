import {
    BooleanInput,
    CreateButton,
    DatagridConfigurable,
    DateField,
    DateInput,
    FilterButton,
    List,
    NumberField,
    SelectColumnsButton,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {AccountReferenceField, AccountReferenceInput} from '../account/AccountReference'
import {CommentField} from '../../components/comment'
import {LandReferenceInput} from '../land/LandReference'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'

const filters = [
    <TextInput source="account#number@_ilike,comment,account#persons#person#full_name@_ilike" label="Поиск"
    />,
    <BooleanInput source="is_discount" label="Скидка"/>,
    <BooleanInput source="is_regular" label="Начисление"/>,
    <AccountReferenceInput source="account_id" alwaysOn/>,
    <PersonReferenceInput source="person_id" label="Плательщик" alwaysOn/>,
    <MemberRateReferenceInput source="rate_id"/>,
    <DateInput source="paid_at" label="Дата платежа"/>,
    <LandReferenceInput source="land_id"/>,
]

const MemberPaymentActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const MemberPaymentList = () => {
    return (
        <List
            actions={<MemberPaymentActions/>}
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}
            perPage={25}
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                rowClick="show"
                omit={['created_at', 'updated_at']}
            >
                <AccountReferenceField link={false}/>
                <PersonReferenceField label="Плательщик" link={false}/>
                <NumberField
                    source="amount"
                    label="Сумма"
                    options={{style: 'currency', currency: 'RUB'}}
                />
                <NumberField
                    source="balance"
                    label="Баланс"
                    options={{style: 'currency', currency: 'RUB'}}
                />
                <DateField source="paid_at" label="Дата"/>
                <CommentField/>

                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </DatagridConfigurable>
        </List>
    )
}

export default MemberPaymentList
