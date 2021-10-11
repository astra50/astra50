import * as React from "react";
import {Datagrid, DateField, List, TextField} from 'react-admin';

export const StreetList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name"/>
            <DateField source="created_at"/>
        </Datagrid>
    </List>
);
