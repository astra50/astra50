import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    Datagrid,
    DateField,
    EditButton,
    EditProps,
    ListButton,
    ReferenceField,
    ReferenceManyField,
    Show,
    ShowActionsProps,
    SimpleShowLayout,
    TextField,
    TopToolbar,
} from 'react-admin'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import {MoneyField} from '../money'
import {PersonField} from './PersonField'

const Actions = ({basePath, data}: ShowActionsProps) => {
    if (!data) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <ListButton
                basePath={'/member_payment?' + new URLSearchParams({filter: JSON.stringify({person_id: data!.id})})}
                label="Членские взносы"
                icon={<FontAwesomeIcon icon={faRubleSign}/>}
            />
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>
    )
}

const PersonShow = (props: EditProps) => {
    return (
        <Show {...props}
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
                <MoneyField source="balance" label="Баланс" addLabel={true}/>
                <DateField source="balance_at" label="Дата обновления баланса" showTime/>
                <MoneyField source="last_paid_amount" label="Сумма последнего платежа" addLabel={true}/>
                <DateField source="last_paid_at" label="Дата последнего платежа"/>
                <TextField source="telegram_id" label="Телеграм ID"/>
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
