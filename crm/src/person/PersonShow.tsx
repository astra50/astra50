import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    DateField,
    EditButton,
    EditProps,
    ListButton,
    Show,
    ShowActionsProps,
    SimpleShowLayout,
    TextField,
    TopToolbar,
} from 'react-admin'
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
                <TextField source="telegram_id" label="Телеграм ID"/>
            </SimpleShowLayout>
        </Show>
    )
}

export default PersonShow
