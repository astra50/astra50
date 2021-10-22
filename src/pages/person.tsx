import {
    Create,
    CreateProps,
    Datagrid,
    DateField,
    DateInput,
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
} from 'react-admin';
import {ListProps} from "ra-ui-materialui/lib/types";
import {Person} from "../types";
import {MoneyField} from "../money";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRubleSign} from "@fortawesome/free-solid-svg-icons";

interface PersonFieldProps extends FieldProps<Person> {
    withPhone?: boolean,
}

export const PersonField = ({record, withPhone = false}: PersonFieldProps) => {
    if (!record) {
        return null
    }

    let result = `${record.lastname ?? ''} ${record.firstname ?? ''} ${record.middlename ?? ''}`.trim();

    if (!result) {
        result = record.phone;
    } else if (withPhone && record.phone) {
        result += ` (${record.phone})`;
    }

    return <span>{result}</span>;
};

export const PersonList = (props: ListProps) => (
    <List {...props}
          title={"Садоводы"}
          empty={false}
    >
        <Datagrid
            rowClick="show"
        >
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <TextField source="phone" label="Телефон"/>
            <MoneyField source="balance" label="Баланс"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const PersonTitle = (props: FieldProps<Person>) => {
    const {record} = props

    return <PersonField record={record}/>;
};

export const PersonEdit = (props: EditProps) => (
    <Edit {...props} title={<PersonTitle/>}>
        <SimpleForm>
            <TextInput source="lastname" label="Фамилия"/>
            <TextInput source="firstname" label="Имя"/>
            <TextInput source="middlename" label="Отчество"/>
            <TextInput source="phone" label="Телефон"/>
            <DateInput source="birth_date" label="День рождения"/>
        </SimpleForm>
    </Edit>
);

export const PersonCreate = (props: CreateProps) => (
    <Create {...props} title={"Создать садовода"}>
        <SimpleForm redirect="list">
            <TextInput source="lastname" label="Фамилия"/>
            <TextInput source="firstname" label="Имя"/>
            <TextInput source="middlename" label="Отчество"/>
            <TextInput source="phone" label="Телефон"/>
            <DateInput source="birth_date" label="День рождения"/>
        </SimpleForm>
    </Create>
);

const PersonShowActions = ({basePath, data}: ShowActionsProps) => {
    if (!data) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <ListButton
                basePath={"/member_payment?" + new URLSearchParams({filter: JSON.stringify({person_id: data!.id})})}
                label="Членские взносы"
                icon={<FontAwesomeIcon icon={faRubleSign}/>}
            />
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>
    );
};

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
            <DateField source="birth_date" label="День рождения"/>
            <MoneyField source="balance" label="Баланс" addLabel={true}/>
            <DateField source="balance_at" label="Дата обновления баланса" showTime/>
        </SimpleShowLayout>
    </Show>
)
