import {faFileZipper, faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
    Button,
    ChipField,
    Datagrid,
    DateField,
    EditButton,
    ReferenceField,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    TopToolbar,
    useRecordContext,
    WithRecord,
} from 'react-admin'
import {Link} from 'react-router-dom'
import account_land from '../account_land'
import account_person from '../account_person'
import {CommentField} from '../components/comment'
import member_payment from '../member_payment'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'
import {Account} from '../types'

const Actions = () => {
    const record = useRecordContext<Account>()

    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                label="Участок"
                component={Link}
                to={{
                    pathname: `/${account_land.name}/create`,
                    state: {record: {account_id: record!.id}},
                }}
                startIcon={<FontAwesomeIcon icon={faPlus}/>}
            />
            <Button
                label="Житель"
                component={Link}
                to={{
                    pathname: `/${account_person.name}/create`,
                    state: {record: {account_id: record!.id}},
                }}
                startIcon={<FontAwesomeIcon icon={faPlus}/>}
            />
            <Button
                label="Платёж"
                component={Link}
                to={{
                    pathname: `/${member_payment.name}/create`,
                    state: {record: {account_id: record!.id, person_id: record!.person_id}},
                }}
                startIcon={<FontAwesomeIcon icon={faPlus}/>}
            />
            <EditButton record={record}/>
        </TopToolbar>
    )
}

const Title = () => {
    const record = useRecordContext<Account>()

    return <span>Лицевой счёт {record?.number ? `"${record.number}"` : ''}</span>
}

const AccountShow = () => {
    return (
        <>
            <Show
                title={<Title/>}
                actions={<Actions/>}
            >
                <SimpleShowLayout>
                    <TextField source="number" label="Номер"/>
                    <CommentField/>
                    <PersonReferenceField label="Владелец"/>
                    <ReferenceManyField label="Участки" reference="account_land" target="account_id" sortable={false}>
                        <SingleFieldList>
                            <ReferenceField reference="land" source="land_id" link={false}>
                                <ChipField source="number"/>
                            </ReferenceField>
                        </SingleFieldList>
                    </ReferenceManyField>
                    <ReferenceManyField label="Жители" reference="account_person" target="account_id" sortable={false}
                                        sort={{field: 'person.lastname', order: 'ASC'}}>
                        <Datagrid bulkActionButtons={false}>
                            <PersonReferenceField label={false}/>
                            <EditButton/>
                        </Datagrid>
                    </ReferenceManyField>
                    <MoneyField source="balance" label="Баланс"/>
                    <DateField
                        source="end_at"
                        label="Дата закрытия"
                    />
                </SimpleShowLayout>
                <WithRecord render={(record: Account) => {
                    if (record.balance >= 0) return <></>

                    return <>
                        <hr/>
                        <Card>
                            <CardContent>
                                <DownloadCalculationButton/>
                            </CardContent>
                        </Card>
                    </>
                }}/>
            </Show>
        </>
    )
}

const DownloadCalculationButton = () => {
    const record = useRecordContext<Account>()

    return <>
        <Button
            label="Судебные документы"
            component="a"
            onClick={function () {
                window.open(
                    `${window.location.origin.replace('crm', 'workflow')}/webhook/39e25294-01f3-4073-9975-1a67bb002e24/${record.id}`,
                    '_blank',
                )
            }}
            startIcon={<FontAwesomeIcon icon={faFileZipper}/>}
        />
    </>
}

export default AccountShow
