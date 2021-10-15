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
    SelectInput,
    SimpleForm,
    TextField,
} from 'react-admin';
import {PersonReferenceField} from "./person";


export const LandOwnershipList = props => (
    <List {...props}
          title={"Владение"}
          empty={false}
    >
        <Datagrid>
            <ReferenceField source="land_id" reference="land" label="Участок">
                <TextField source="number"/>
            </ReferenceField>
            <ReferenceField source="owner_id" reference="person" label="Владелец">
                <PersonReferenceField source="lastname"/>
            </ReferenceField>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const LandOwnershipEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput
                source="land_id"
                reference="land"
                label="Участок"
                perPage={500}
                sort={{field: 'number', order: 'ASC'}}
            >
                <SelectInput optionText="number"/>
            </ReferenceInput>
            <ReferenceInput
                source="owner_id"
                reference="person"
                label="Владелец"
                perPage={500}
                sort={{field: 'lastname', order: 'ASC'}}
            >
                <SelectInput optionText={<PersonReferenceField withPhone={true}/>}/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Edit>
);

export const LandOwnershipCreate = props => (
    <Create {...props} title={"Создать владение"}>
        <SimpleForm redirect="list">
            <ReferenceInput
                source="land_id"
                reference="land"
                label="Участок"
                perPage={500}
                sort={{field: 'number', order: 'ASC'}}
            >
                <SelectInput optionText="number"/>
            </ReferenceInput>
            <ReferenceInput
                source="owner_id"
                reference="person"
                label="Владелец"
                perPage={500}
                sort={{field: 'lastname', order: 'ASC'}}
            >
                <SelectInput optionText={<PersonReferenceField withPhone={true}/>}/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Create>
);
