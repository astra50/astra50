import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Add,Call, Email} from '@mui/icons-material'
import {Divider} from '@mui/material'

import {
    BooleanField,
    Button,
    Datagrid,
    DateField,
    EditButton,
    FunctionField,
    ReferenceField,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext, WithRecord,
} from 'react-admin'
import {Link} from 'react-router-dom'
import account from '../account'
import {AccountReferenceField} from '../account/AccountReference'
import {MoneyField} from '../money'
import {PersonEmailReferenceField} from '../person_email/PersonEmailReference'
import {PersonPhoneReferenceField} from '../person_phone/PersonPhoneReference'
import {Person, PersonPhone} from '../types'
import {PersonField} from './PersonField'

const Actions = () => {
    const record = useRecordContext<Person>()

    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                component={Link}
                to={{
                    pathname: `/member_payment`,
                    search: `filter=${JSON.stringify({person_id: record!.id})}`,
                }}
                startIcon={<FontAwesomeIcon icon={faRubleSign}/>}
                label="Членские взносы"
            />
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
                <FunctionField label="Фамилия Имя Отчество"
                               render={(record: Person) => `${record.lastname} ${record.firstname} ${record.middlename}`}/>
                <TextField source="comment" label="Комментарий"/>

                <Divider>Контакты</Divider>
                <ReferenceManyField
                    label="Электронные адреса"
                    reference="person_email"
                    target="person_id"
                >
                    <Datagrid bulkActionButtons={false}>
                        <PersonEmailReferenceField label={false} sortable={false}/>
                        <BooleanField source="is_main" label="Основной?"/>
                        <FunctionField render={function (record: PersonPhone) {
                            return <Button href={'mailto:' + record.phone} label="Письмо"><Email/></Button>
                        }}/>
                    </Datagrid>
                </ReferenceManyField>
                <WithRecord render={function (record: Person) {
                    return <Button
                        component={Link}
                        to={{
                            pathname: `/person_email/create`,
                            state: {record: {person_id: record.id}},
                        }}
                        label="Добавить E-Mail"
                        fullWidth
                    ><Add/></Button>
                }}/>

                <ReferenceManyField
                    label="Телефоны"
                    reference="person_phone"
                    target="person_id"
                >
                    <Datagrid bulkActionButtons={false}>
                        <PersonPhoneReferenceField label={false} sortable={false}/>
                        <BooleanField source="is_main" label="Основной?"/>
                        <FunctionField render={function (record: PersonPhone) {
                            return <Button href={'tel:' + record.phone} label="Звонок"><Call/></Button>
                        }}/>
                    </Datagrid>
                </ReferenceManyField>
                <WithRecord render={function (record: Person) {
                    return <Button
                        component={Link}
                        to={{
                            pathname: `/person_phone/create`,
                            state: {record: {person_id: record.id}},
                        }}
                        label="Добавить телефон"
                        fullWidth
                    ><Add/></Button>
                }}/>
                <TextField source="telegram_id" label="Телеграм ID"/>

                <Divider>Член СНТ</Divider>
                <DateField source="entered_at" label="Дата вступления"/>
                <TextField source="entered_document" label="Документ вступления"/>

                <Divider>Финансы</Divider>
                <ReferenceManyField label={false} reference="account_person" target="person_id"
                                    sortable={false}>
                    <Datagrid bulkActionButtons={false}>
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
                <MoneyField source="balance" label="Баланс"/>
                <DateField source="balance_at" label="Дата обновления баланса" showTime/>
                <MoneyField source="last_paid_amount" label="Сумма последнего платежа"/>
                <DateField source="last_paid_at" label="Дата последнего платежа"/>

                <Divider>Документы</Divider>
                <TextField
                    source="registration_address"
                    label="Адрес регистрации"
                    fullWidth
                />
                <TextField
                    source="passport_serial"
                    label="Серия паспорта"
                    fullWidth
                />
                <TextField
                    source="passport_number"
                    label="Номер паспорта"
                    fullWidth
                />
                <TextField
                    source="passport_issued_by"
                    label="Кем выдан паспорт"
                    fullWidth
                />
                <DateField
                    source="passport_issued_date"
                    label="Дата выдачи паспорта"
                    fullWidth
                />
                <TextField
                    source="passport_issued_code"
                    label="Код подразделения"
                    fullWidth
                />
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonShow
