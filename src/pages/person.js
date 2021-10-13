import * as React from "react";
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';

export const PersonList = props => (
    <List {...props}
          title={"Садоводы"}
          empty={false}
    >
        <Datagrid>
            <TextField source="lastname" label="Фамилия"/>
            <TextField source="firstname" label="Имя"/>
            <TextField source="middlename" label="Отчество"/>
            <TextField source="phone" label="Телефон"/>
            <DateField source="birth_date" label="День рождения"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const PersonTitle = ({record}) => {
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
