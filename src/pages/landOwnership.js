import * as React from "react";
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    ReferenceField,
    ReferenceInput,
    ReferenceManyField,
    SelectInput,
    SimpleForm,
    TextField,
} from 'react-admin';

export const LandOwnershipList = props => (
    <List {...props} title={"Владение"}>
        <Datagrid>
            <ReferenceField source="land_id" reference="land" label="Участок">
                <TextField source="number"/>
            </ReferenceField>
            <ReferenceManyField target="ownership_id" reference="land_owner" label="Владелец">
                <ReferenceField source="owner_id" reference="person">
                    <TextField source="firstname"/>
                </ReferenceField>
            </ReferenceManyField>
            <DateField source="since"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const LandOwnershipEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput source="land_id" reference="land" label="Участок">
                <SelectInput optionText="number"/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Edit>
);

export const LandOwnershipCreate = props => (
    <Create {...props} title={"Создать владение"}>
        <SimpleForm redirect="list">
            <ReferenceInput source="land_id" reference="land" label="Участок">
                <SelectInput optionText="number"/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Create>
);
