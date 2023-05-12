import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
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
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
// @ts-ignore
import {Link} from 'react-router-dom'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import member_discount from '../member_discount'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'
import {MemberDiscount, MemberRate} from '../types'
import {MemberRateField} from './MemberRateField'

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
            title={<MemberRateField/>}
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <MoneyField source="amount" label="Ставка"/>
                <NumberField source="discount" label="Скидка"/>
                <DateField source="since" label="С даты"/>
                <DateField source="until" label="По дату"/>

                <TextField
                    source="comment"
                    label="Комментарий"
                    fullWidth={true}
                />

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
                        <TextField
                            source="comment"
                            label="Комментарий"
                        />
                        <MemberDiscountEditButton/>
                    </Datagrid>
                </ReferenceManyField>
            </SimpleShowLayout>
        </Show>
    )
}

export default MemberRateShow

const MemberDiscountEditButton = () => {
    let record = useRecordContext<MemberDiscount>()

    return <EditButton resource={member_discount.name} record={record} label="Редактировать"/>
}
