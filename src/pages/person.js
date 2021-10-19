import * as React from "react";
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';

export const PersonReferenceField = (props) => {
    const record = useRecordContext(props);

    let result = `${record.lastname ?? ''} ${record.firstname ?? ''} ${record.middlename ?? ''}`.trim();

    if (!result) {
        result = record.phone;
    } else if (props.withPhone && record.phone) {
        result += ` (${record.phone})`;
    }

    return <span>{result}</span>;
}

export const PersonList = props => (
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
            <DateField source="birth_date" label="День рождения"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const PersonTitle = ({record}) => {
    return <span>Садовод {record ? `"${record.lastname} ${record.firstname}"` : ''}</span>;
};

export const PersonEdit = props => (
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

export const PersonCreate = props => (
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

export const PersonShow = props => (
    <Show {...props}
          title={"Садовод"}
    >
        <SimpleShowLayout>
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <TextField source="phone" label="Телефон"/>
            <DateField source="birth_date" label="День рождения"/>
        </SimpleShowLayout>
    </Show>
)
