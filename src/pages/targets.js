import * as React from "react";
import {Create, Datagrid, Edit, EditButton, List, SimpleForm, TextField, TextInput} from 'react-admin';

export const TargetList = props => (
    <List {...props}
          title="Цели"
          empty={false}
    >
        <Datagrid>
            <TextField source="name" label="Цель"/>
            <TextField source="comment" label="Комментарий"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const TargetTitle = ({record}) => {
    return <span>Цель {record ? `"${record.name}"` : ''}</span>;
};

export const TargetEdit = props => (
    <Edit {...props} title={<TargetTitle/>}>
        <SimpleForm>
            <TextInput source="name" label="Цель"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Edit>
);

export const TargetCreate = props => (
    <Create {...props} title={"Создать Ставку"}>
        <SimpleForm redirect="list">
            <TextInput source="name" label="Цель"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Create>
);
