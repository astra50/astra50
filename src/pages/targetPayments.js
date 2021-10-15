import * as React from "react";
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import {PersonReferenceField} from "./person";

export const TargetPaymentList = props => (
    <List {...props}
          title="Цели"
          empty={false}
    >
        <Datagrid>
            <ReferenceField source="target_id" reference="target" label="Цель">
                <TextField source="name"/>
            </ReferenceField>
            <ReferenceField source="person_id" reference="person" label="Плательщик">
                <PersonReferenceField/>
            </ReferenceField>
            <NumberField
                source="amount"
                label="Сумма"
                options={{style: 'currency', currency: 'RUB'}}
            />
            <DateField source="paid_at" label="Дата"/>
            <TextField source="comment" label="Комментарий"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const TargetForm = props => (<SimpleForm {...props}>
        <ReferenceInput
            source="target_id"
            reference="target"
            label="Цель"
            perPage={500}
            sort={{field: 'name', order: 'ASC'}}
            validate={required()}
        >
            <SelectInput optionText="name"/>
        </ReferenceInput>

        <ReferenceInput
            source="person_id"
            reference="person"
            label="Плательщик"
            perPage={500}
            sort={{field: 'lastname', order: 'ASC'}}
            validate={required()}
        >
            <SelectInput optionText={<PersonReferenceField withPhone={true}/>}/>
        </ReferenceInput>

        <NumberInput
            source="amount"
            label="Сумма"
            validate={required()}
        />

        <DateInput
            source="paid_at"
            label="Дата платежа"
            validate={required()}
        />

        <TextInput source="comment" label="Комментарий"/>
    </SimpleForm>
);

export const TargetPaymentEdit = props => (
    <Edit {...props} title="Целевой взнос">
        <TargetForm/>
    </Edit>
);

export const TargetPaymentCreate = props => (
    <Create {...props} title={"Создать целевой взнос"}>
        <TargetForm redirect="list"/>
    </Create>
);
