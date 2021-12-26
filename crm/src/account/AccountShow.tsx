import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button'
import {
    ChipField,
    Datagrid,
    EditButton,
    EditProps,
    FieldProps,
    ReferenceField,
    ReferenceManyField,
    Show,
    ShowActionsProps,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    TopToolbar,
} from 'react-admin'
// @ts-ignore
import {Link} from 'react-router-dom'
import account_land from '../account_land'
import account_person from '../account_person'
import {CommentField} from '../comment'
import member_payment from '../member_payment'
import {MoneyField} from '../money'
import {PersonReferenceField} from '../person/PersonReference'
import {Account} from '../types'

const Actions = ({basePath, data}: ShowActionsProps) => {
    if (!data) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                component={Link}
                to={{
                    pathname: `/${account_land.name}/create`,
                    state: {record: {account_id: data!.id}},
                }}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Участок
            </Button>
            <Button
                component={Link}
                to={{
                    pathname: `/${account_person.name}/create`,
                    state: {record: {account_id: data!.id}},
                }}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Житель
            </Button>
            <Button
                component={Link}
                to={{
                    pathname: `/${member_payment.name}/create`,
                    state: {record: {account_id: data!.id, person_id: data!.person_id}},
                }}
            >
                <FontAwesomeIcon icon={faPlus}/>&nbsp;Платёж
            </Button>
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>
    )
}

const Title = (props: FieldProps<Account>) => {
    const {record} = props

    return <span>Лицевой счёт {record?.number ? `"${record.number}"` : ''}</span>
}

const AccountShow = (props: EditProps) => {
    return (
        <Show {...props}
              title={<Title/>}
              actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="number" label="Номер"/>
                <CommentField addLabel={true}/>
                <PersonReferenceField label="Владелец" addLabel={true}/>
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
                        <PersonReferenceField addLabel={false}/>
                        <EditButton/>
                    </Datagrid>
                </ReferenceManyField>
                <MoneyField source="balance" label="Баланс" addLabel={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default AccountShow
