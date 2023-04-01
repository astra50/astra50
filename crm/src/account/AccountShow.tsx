import {gql, useLazyQuery} from '@apollo/client'
import {faFileExcel, faFileWord, faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {CardHeader} from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Docxtemplater from 'docxtemplater'
import {saveAs} from 'file-saver'
import moment from 'moment'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils'
import {
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
} from 'react-admin'
import ReactMarkdown from 'react-markdown'
import {Link} from 'react-router-dom'
import account_land from '../account_land'
import account_person from '../account_person'
import {CommentField} from '../comment'
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
                component={Link}
                to={{pathname: `/${account_land.name}/create`}}
                state={{record: {account_id: record!.id}}}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Участок
            </Button>
            <Button
                component={Link}
                to={{
                    pathname: `/${account_person.name}/create`,
                }}
                state={{record: {account_id: record!.id}}}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Житель
            </Button>
            <Button
                component={Link}
                to={{pathname: `/${member_payment.name}/create`}}
                state={{record: {account_id: record!.id, person_id: record!.person_id}}}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Платёж
            </Button>
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
                        <Datagrid>
                            <PersonReferenceField label={false}/>
                            <EditButton/>
                        </Datagrid>
                    </ReferenceManyField>
                    <MoneyField source="balance" label="Баланс"/>
                    <DateField
                        source="end_at"
                        label="Закрыт"
                    />
                </SimpleShowLayout>
                <hr/>
                <Card>
                    <CardHeader title="Судебные документы"/>
                    <CardContent>
                        <DownloadStatementButton/>
                        <br/>
                        <DownloadCalculationButton/>
                    </CardContent>
                </Card>
            </Show>
        </>
    )
}

const DownloadStatementButton = () => {
    const markdown = `
1. Сумма требований указана без процентов (скопировать из расчёта процентов) 
2. Период задолженности не указан (взять первые и последние даты из расчёта процентов)
`

    const record = useRecordContext<Account>()

    const QUERY = gql`
        query Doc($id: uuid!) {
            account_by_pk(id: $id) {
                balance
                person {
                    lastname
                    firstname
                    middlename
                    registration_address
                    entered_at
                    entered_document
                }
                lands {
                    land {
                        number
                        cadastral_number
                        square
                    }
                }
            }
        }
    `

    const [getData] = useLazyQuery<any>(QUERY)

    if (!record) return null

    return <>
        <Button
            onClick={async function () {
                const response = await getData({variables: {id: record.id}}) as any

                const account = response.data.account_by_pk
                const land = account.lands[0].land
                const person = account.person

                const formatter = new Intl.NumberFormat('RU', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    useGrouping: false,
                })

                PizZipUtils.getBinaryContent(
                    '/doc/statement.docx',
                    function (error, content) {
                        if (error) {
                            throw error
                        }

                        const zip = new PizZip(content)
                        const doc = new Docxtemplater(zip, {
                            paragraphLoop: true,
                            linebreaks: true,
                        })

                        doc.render({
                            fullname: `${person.lastname} ${person.firstname} ${person.middlename}`.trim(),
                            passport_address: person.registration_address,
                            entered_at: moment(person.entered_at).format('L'),
                            entered_document: person.entered_document,
                            land_number: land.number,
                            land_cadastral: land.cadastral_number,
                            land_square: land.square * 100,
                            debt_since: '__FIX_ME__',
                            debt_until: '__FIX_ME__',
                            sum: formatter.format(account.balance * -1),
                            sum_text: '__СУММА_ТЕКСТОМ__',
                            penalty: '__НЕУСТОЙКА__',
                            penalty_text: '__НЕУСТОЙКА_ТЕКСТОМ__',
                            today: moment().format('LL'),
                        })

                        const blob = doc.getZip().generate({
                            type: 'blob',
                            mimeType:
                                'application/octet-stream',
                        })

                        saveAs(blob, 'Заявление о выдаче судебного приказа.docx')
                    },
                )

            }}
        >
            <FontAwesomeIcon icon={faFileWord}/>&nbsp;Заявление о выдаче судебного приказа
        </Button>
        <ReactMarkdown>{markdown}</ReactMarkdown>
    </>
}
const DownloadCalculationButton = () => {
    const markdown = `
1. При импорте в Excel поставить галочку "Вычислять формулы"
`

    return <>
        <Button
            component="a"
            href={`${window.location.origin.replace('crm', 'workflow')}/webhook/39e25294-01f3-4073-9975-1a67bb002e24/`}
            target="_blank"
        >
            <FontAwesomeIcon icon={faFileExcel}/>&nbsp;Расчёт процентов
        </Button>
        <ReactMarkdown>{markdown}</ReactMarkdown>
    </>
}

export default AccountShow
