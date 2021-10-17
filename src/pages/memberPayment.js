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
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import {PersonReferenceField} from "./person";

export const MemberPaymentList = props => (
    <List {...props}
          title="Членские взносы"
          empty={false}
          sort={{field: 'paid_at', order: 'DESC'}}
    >
        <Datagrid>
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
)

const MemberPaymentForm = props => (
    <SimpleForm {...props}>
        <ReferenceInput
            source="person_id"
            reference="person"
            label="Плательщик"
            perPage={500}
            sort={{field: 'lastname', order: 'ASC'}}
        >
            <SelectInput optionText={<PersonReferenceField withPhone={true}/>}/>
        </ReferenceInput>

        <NumberInput
            source="amount"
            label="Сумма"
        />

        <ReferenceInput
            source="land_id"
            reference="land"
            label="Участок"
            perPage={500}
            sort={{field: 'number', order: 'ASC'}}
        >
            <SelectInput optionText="number"/>
        </ReferenceInput>
        <DateInput source="paid_at" label="Дата платежа"/>
        <TextInput source="comment" label="Комментарий"/>
    </SimpleForm>
)

export const MemberPaymentEdit = props => (
    <Edit {...props} title="Членский Взнос">
        <MemberPaymentForm/>
    </Edit>
)

export const MemberPaymentCreate = props => (
    <Create {...props} title={"Создать платёж"}>
        <MemberPaymentForm redirect="list"/>
    </Create>
)
