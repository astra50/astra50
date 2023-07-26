import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    DateInput,
    FilterButton,
    List,
    SelectColumnsButton,
    TextInput,
    TopToolbar,
    WithRecord,
} from 'react-admin'
import {CommentField} from '../components/comment'
import {ContractorReferenceField} from '../contractor/ContractorReference'
import {LandReferenceField} from '../land/LandReference'
import {MoneyField} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceField, TargetReferenceInput} from '../target/TargetReference'

const filters = [
    <TargetReferenceInput source="target_id" alwaysOn/>,
    <TextInput source="person#full_name@_ilike,comment" label="Поиск"/>,
    <PersonReferenceInput source="person_id"/>,
    <DateInput source="paid_at" label="Дата"/>,
]

const TargetPaymentActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const TargetPaymentList = () => {
    return (
        <List
            actions={<TargetPaymentActions/>}
            title="Целевые взносы"
            empty={false}
            filters={filters}
            sort={{field: 'paid_at', order: 'DESC'}}
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                rowClick="show"
                omit={['created_at', 'updated_at']}
            >
                <TargetReferenceField link={false}/>
                <WithRecord label="Плательщик / Контрагент" render={record => {
                    if (record.person_id) return <PersonReferenceField link={false}/>

                    return <ContractorReferenceField link={false}/>
                }}/>
                <LandReferenceField link={false}/>
                <MoneyField
                    source="amount"
                    label="Сумма"
                />
                <DateField source="paid_at" label="Дата"/>
                <CommentField/>

                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </DatagridConfigurable>
        </List>
    )
}

export default TargetPaymentList
