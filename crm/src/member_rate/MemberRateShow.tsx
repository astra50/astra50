import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Divider} from '@mui/material'
import {
    Button,
    Datagrid,
    DateField,
    EditButton,
    NumberField,
    ReferenceField,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
// @ts-ignore
import {Link} from 'react-router-dom'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import {CommentField} from '../components/comment'
import member_discount from '../member_discount'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'
import {MemberDiscount, MemberRate} from '../types'

const Actions = () => {
    const record = useRecordContext<MemberRate>()
    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                label="Льготник"
                component={Link}
                to={{
                    pathname: `/${member_discount.name}/create`,
                    state: {record: {rate_id: record!.id}},
                }}
                startIcon={<FontAwesomeIcon icon={faPlus}/>}
            />
            <EditButton record={record}/>
        </TopToolbar>
    )
}

const MemberRateShow = () => {
    return (
        <Show
            title="Ставка"
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <MoneyField source="amount" label="Ставка"/>
                <NumberField source="discount" label="Скидка"/>
                <DateField source="since" label="С даты"/>
                <DateField source="until" label="По дату"/>

                <CommentField/>

                <Divider/>
                <ReferenceManyField
                    label="Льготники"
                    reference="member_discount"
                    target="rate_id"
                    sortable={false}>
                    <Datagrid>
                        <AccountReferenceField/>
                        <ReferenceField
                            source="account_id"
                            reference={account.name}
                            link={false}
                            label="Льготник"
                        >
                            <PersonReferenceField source="person_id"/>
                        </ReferenceField>
                        <CommentField/>
                        <MemberDiscountEditButton/>
                    </Datagrid>
                </ReferenceManyField>


                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default MemberRateShow

const MemberDiscountEditButton = () => {
    let record = useRecordContext<MemberDiscount>()

    return <EditButton resource={member_discount.name} record={record} label="Редактировать"/>
}
