import * as React from "react";
import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    NumberField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';

const landFilters = [
    <ReferenceInput source="street_id" label="Улица" reference="street" allowEmpty alwaysOn>
        <SelectInput optionText="name"/>
    </ReferenceInput>,
];

const LandPagination = props => <Pagination rowsPerPageOptions={[50, 100, 150, 200]} {...props} />;

export const LandList = props => (
    <List {...props}
          title={"Участки"}
          filters={landFilters}
          sort={{field: 'number', order: 'ASC'}}
          pagination={<LandPagination/>}
          perPage={200}
    >
        <Datagrid>
            <ReferenceField source="street_id" reference="street" label="Улица">
                <TextField source="name"/>
            </ReferenceField>
            <NumberField source="number" label="Номер"/>
            <NumberField source="square" label="Площадь"/>
            <TextField source="cadastral_number" label="Кадастровый номер"/>
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
            <TextInput source="cadastral_number" label="Кадастровый номер"/>
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
            <TextInput source="cadastral_number" label="Кадастровый номер"/>
        </SimpleForm>
    </Create>
);
