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

export const PaymentList = props => (
    <List {...props} title={"Платежи"}>
        <Datagrid>
            <ReferenceField source="ownership_id" reference="land_ownership" label="Участок">
                <ReferenceField source="land_id" reference="land" label="Участок">
                    <TextField source="number"/>
                </ReferenceField>
            </ReferenceField>
            <NumberField source="amount" label="Сумма"/>
            <TextField source="comment" label="Комментарий"/>
            <DateField source="payment_at" label="Дата платежа"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const PaymentTitle = ({record}) => {
    return <span>Платёж {record ? `"${record.comment}" от "${record.payment_at}"` : ''}</span>;
};

export const PaymentEdit = props => (
    <Edit {...props} title={<PaymentTitle/>}>
        <SimpleForm>
            <ReferenceInput source="ownership_id" reference="land_ownership" label="Участок">
                <SelectInput optionText="id"/>
            </ReferenceInput>
            <NumberInput source="amount" label="Сумма"/>
            <DateInput source="payment_at" label="Дата платежа"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Edit>
);

export const PaymentCreate = props => (
    <Create {...props} title={"Создать платёж"}>
        <SimpleForm>
            <ReferenceInput source="ownership_id" reference="land_ownership" label="Участок">
                <SelectInput optionText="id"/>
            </ReferenceInput>
            <NumberInput source="amount" label="Сумма"/>
            <DateInput source="payment_at" label="Дата платежа"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Create>
);
