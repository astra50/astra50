import {faFileZipper, faPlus, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {useState} from 'react'
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
import {CommentField} from '../../components/comment'
import {MoneyField} from '../../components/money'
import {Account} from '../../types'
import account_land from '../account_land'
import account_person from '../account_person'
import member_payment from '../member_payment'
import {PersonReferenceField} from '../person/PersonReference'

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

const AccountShow = () => {
    return (
        <Show
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>

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
    )
}

const DownloadCalculationButton = () => {
    const record = useRecordContext<Account>()
    const [loading, setLoading] = useState(false)

    return <Button
        label="Судебные документы"
        component="a"
        disabled={loading}
        onClick={function (e) {
            e.preventDefault()

            setLoading(true)

            fetch(`${window.location.origin.replace('crm', 'workflow')}/webhook/court?id=${record.id}`)
            .then(res => res.blob())
            .then(function (blob) {
                const a = document.createElement('a')
                a.href = window.URL.createObjectURL(blob)
                a.download = `Судебные документы ${record.number}`
                a.click()
            })
            .finally(function () {
                setLoading(false)
            })
        }}
        startIcon={loading ? <FontAwesomeIcon icon={faSpinner} spinPulse/> : <FontAwesomeIcon icon={faFileZipper}/>}
    />
}

export default AccountShow
