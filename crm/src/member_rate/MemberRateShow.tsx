import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button'
import {
    Datagrid,
    DateField,
    EditButton,
    NumberField,
    ReferenceField,
    ReferenceManyField,
    Show,
    ShowActionsProps,
    ShowProps,
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
import {MemberDiscount} from '../types'
import {MemberRateField} from './MemberRateField'

const Actions = ({basePath, data}: ShowActionsProps) => {
    if (!data) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                component={Link}
                to={{
                    pathname: `/${member_discount.name}/create`,
                    state: {record: {rate_id: data!.id}},
                }}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Льготник
            </Button>
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>
    )
}

const MemberRateShow = (props: ShowProps) => {

    return (
        <Show {...props}
              title={<MemberRateField/>}
              actions={<Actions/>}
        >
            <SimpleShowLayout>
                <MoneyField source="amount" label="Ставка" addLabel={true}/>
                <NumberField source="discount" label="Скидка" addLabel={true}/>
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

    return <EditButton basePath={`/${member_discount.name}/${record.id}`} record={record} label="Редактировать"/>
}
