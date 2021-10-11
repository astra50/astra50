import * as React from "react";
import {Datagrid, List, NumberField, ReferenceField, TextField} from 'react-admin';

export const LandList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <ReferenceField source="street_id" reference="street" label="Улица">
                <TextField source="name"/>
            </ReferenceField>
            <NumberField source="number"/>
            <NumberField source="square"/>
        </Datagrid>
    </List>
);
