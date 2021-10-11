import * as React from "react";
import {
    Datagrid,
    Edit,
    EditButton,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField
} from 'react-admin';

export const LandList = props => (
    <List {...props}>
        <Datagrid>
            <ReferenceField source="street_id" reference="street" label="Улица">
                <TextField source="name"/>
            </ReferenceField>
            <NumberField source="number"/>
            <NumberField source="square"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const LandEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <NumberInput source="number"/>
            <NumberInput source="square"/>
            <ReferenceInput source="street_id" reference="street">
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);
