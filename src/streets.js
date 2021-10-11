import * as React from "react";
import {Datagrid, Edit, EditButton, List, SimpleForm, TextField, TextInput} from 'react-admin';

export const StreetList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="name"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const StreetEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name"/>
        </SimpleForm>
    </Edit>
);
