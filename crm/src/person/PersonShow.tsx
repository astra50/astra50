import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'

import {
    Datagrid,
    DateField,
    EditButton,
    ReferenceField,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
import {Link} from 'react-router-dom'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import member_payment from '../member_payment'
import {MoneyField} from '../money'
import {Person} from '../types'
import {PersonField} from './PersonField'

const Actions = () => {
    const record = useRecordContext<Person>()

    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                color="primary"
                component={Link}
                to={{
                    pathname: `/${member_payment.name}`,
                    search: `filter=${JSON.stringify({person_id: record!.id})}`,
                }}
            >
                <FontAwesomeIcon icon={faRubleSign}/> Членские взносы
            </Button>
            <EditButton record={record}/>
        </TopToolbar>
    )
}

const PersonShow = () => {
    return (
        <Show
            title={<PersonField/>}
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="lastname" label="Фамилия"/>
                <TextField source="firstname" label="Имя"/>
                <TextField source="middlename" label="Отчество"/>
                <TextField source="phone" label="Телефон"/>
                <TextField source="phone_second" label="Телефон2"/>
                <TextField source="email" label="E-mail"/>
                <TextField source="comment" label="Комментарий"/>
                <MoneyField source="balance" label="Баланс"/>
                <DateField source="balance_at" label="Дата обновления баланса" showTime/>
                <MoneyField source="last_paid_amount" label="Сумма последнего платежа"/>
                <DateField source="last_paid_at" label="Дата последнего платежа"/>
                <TextField source="telegram_id" label="Телеграм ID"/>
                <DateField source="entered_at" label="Дата вступления"/>
                <TextField source="entered_document" label="Документ вступления"/>
                <ReferenceManyField label="Лицевые счета" reference="account_person" target="person_id"
                                    sortable={false}>
                    <Datagrid>
                        <AccountReferenceField/>
                        <ReferenceField
                            source="account_id"
                            reference={account.name}
                            link={false}
                            label="Баланс"
                        >
                            <MoneyField source="balance" label="Баланс"/>
                        </ReferenceField>
                    </Datagrid>
                </ReferenceManyField>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonShow
