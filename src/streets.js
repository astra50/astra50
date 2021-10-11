import * as React from "react";
import {Datagrid, EditButton, List, TextField} from 'react-admin';

export const StreetList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="name"/>
            <EditButton/>
        </Datagrid>
    </List>
);
