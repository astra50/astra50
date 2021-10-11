import * as React from "react";
import {
    Create,
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
    TextField,
} from 'react-admin';

const landFilters = [
    <ReferenceInput source="street_id" label="Улица" reference="street" allowEmpty alwaysOn>
        <SelectInput optionText="name"/>
    </ReferenceInput>,
];

export const LandList = props => (
    <List {...props} filters={landFilters}>
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

const LandTitle = ({record}) => {
    return <span>Участок {record ? `"${record.number}"` : ''}</span>;
};

export const LandEdit = props => (
    <Edit {...props} title={<LandTitle/>}>
        <SimpleForm>
            <NumberInput source="number"/>
            <NumberInput source="square"/>
            <ReferenceInput source="street_id" reference="street">
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const LandCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <NumberInput source="number"/>
            <NumberInput source="square"/>
            <ReferenceInput source="street_id" reference="street">
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
