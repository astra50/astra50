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
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
// @ts-ignore
import {Link} from 'react-router-dom'
import {CommentField} from '../../components/comment'
import {MoneyField} from '../../components/money'
import {MemberRate} from '../../types'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import member_discount from '../member_discount'
import {PersonReferenceField} from '../person/PersonReference'

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
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>
                <MoneyField source="amount" label="Ставка"/>
                <NumberField source="discount" label="Скидка"/>
                <DateField source="since" label="С даты"/>
                <DateField source="until" label="По дату"/>

                <CommentField/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>

                <Divider/>
                <ReferenceManyField
                    label="Льготники"
                    reference="member_discount"
                    target="rate_id"
                    sortable={false}
                    perPage={100500}
                >
                    <Datagrid bulkActionButtons={false} rowClick="show">
                        <AccountReferenceField link={false}/>
                        <ReferenceField
                            source="account_id"
                            reference={account.name}
                            link={false}
                            label="Льготник"
                        >
                            <PersonReferenceField source="person_id" link={false}/>
                        </ReferenceField>
                        <CommentField/>
                    </Datagrid>
                </ReferenceManyField>
            </SimpleShowLayout>
        </Show>
    )
}

export default MemberRateShow
