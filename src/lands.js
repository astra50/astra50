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
    <List {...props} filters={landFilters} title={"Участки"}>
        <Datagrid>
            <ReferenceField source="street_id" reference="street" label="Улица">
                <TextField source="name"/>
            </ReferenceField>
            <NumberField source="number" label="Номер"/>
            <NumberField source="square" label="Площадь"/>
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
            <ReferenceInput source="street_id" reference="street" label="Улица">
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <NumberInput source="number" label="Номер"/>
            <NumberInput source="square" label="Площадь"/>
        </SimpleForm>
    </Edit>
);

export const LandCreate = props => (
    <Create {...props} title={"Создать участок"}>
        <SimpleForm redirect="list">
            <ReferenceInput source="street_id" reference="street" label="Улица">
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <NumberInput source="number" label="Номер"/>
            <NumberInput source="square" label="Площадь"/>
        </SimpleForm>
    </Create>
);
