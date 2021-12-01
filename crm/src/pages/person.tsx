import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {ListProps} from 'ra-ui-materialui/lib/types'
import {
    Create,
    CreateProps,
    Datagrid,
    DateField,
    Edit,
    EditButton,
    EditProps,
    FieldProps,
    List,
    ListButton,
    Show,
    ShowActionsProps,
    ShowProps,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin'
import {MoneyField} from '../money'
import {Person} from '../types'

interface PersonFieldProps extends FieldProps<Person> {
    withPhone?: boolean,
}

export const PersonField = ({record, withPhone = false}: PersonFieldProps) => {
    if (!record) {
        return null
    }

    let result = `${record.lastname ?? ''} ${record.firstname ?? ''} ${record.middlename ?? ''}`.trim()

    if (!result) {
        result = record.phone
    } else if (withPhone && record.phone) {
        result += ` (${record.phone})`
    }
    return <span>{result}</span>
}

const filters = [
    <TextInput source="firstname,lastname,middlename,phone,email,telegram_id" label="Поиск" alwaysOn/>,
]

export const PersonList = (props: ListProps) => (
    <List {...props}
          title={'Садоводы'}
          empty={false}
          filters={filters}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <TextField source="phone" label="Телефон"/>
            <TextField source="phone_second" label="Телефон2"/>
            <TextField source="email" label="E-mail"/>
            <MoneyField source="balance" label="Баланс"/>
            <EditButton/>
        </Datagrid>
    </List>
)

export const PersonTitle = (props: FieldProps<Person>) => {
    const {record} = props
    return <PersonField record={record}/>
}

export const PersonEdit = (props: EditProps) => (
    <Edit {...props} title={<PersonTitle/>}>
        <SimpleForm>
            <TextInput source="lastname" label="Фамилия"/>
            <TextInput source="firstname" label="Имя"/>
            <TextInput source="middlename" label="Отчество"/>
            <TextInput source="phone" label="Телефон"/>
            <TextInput source="phone_second" label="Телефон2"/>
            <TextInput source="email" label="E-mail"/>
            <TextInput source="telegram_id" label="Телеграм ID"/>
        </SimpleForm>
    </Edit>
)

export const PersonCreate = (props: CreateProps) => (
    <Create {...props} title={'Создать садовода'}>
        <SimpleForm redirect="list">
            <TextInput source="lastname" label="Фамилия"/>
            <TextInput source="firstname" label="Имя"/>
            <TextInput source="middlename" label="Отчество"/>
            <TextInput source="phone" label="Телефон"/>
            <TextInput source="phone_second" label="Телефон2"/>
            <TextInput source="email" label="E-mail"/>
            <TextInput source="telegram_id" label="Телеграм ID"/>
        </SimpleForm>
    </Create>
)

const PersonShowActions = ({basePath, data}: ShowActionsProps) => {
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

export const PersonShow = (props: ShowProps) => (
    <Show {...props}
          title={<PersonTitle/>}
          actions={<PersonShowActions/>}
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
