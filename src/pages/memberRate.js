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
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';

export const MemberRateList = props => (
    <List {...props}
          title="Ставки"
          empty={false}
    >
        <Datagrid>
            <NumberField source="amount" label="Ставка"/>
            <TextField source="comment" label="Комментарий"/>
            <DateField source="since" label="С даты"/>
            <DateField source="until" label="По дату"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const MemberRateTitle = ({record}) => {
    return <span>Ставка с {record ? `"${record.since}" по "${record.until}"` : ''}</span>;
};

const MemberRateForm = props => (
    <SimpleForm {...props}>
        <NumberInput
            source="amount"
            label="Ставка"
            helperText="Ставка за сотку"
        />
        <DateInput
            source="since"
            label="С даты"
            helperText="Дата начала действия ставки"
        />
        <DateInput
            source="until"
            label="По дату"
            helperText="Дата завершения действия ставки"
        />
        <TextInput source="comment" label="Комментарий"/>
    </SimpleForm>
);

export const MemberRateEdit = props => (
    <Edit {...props} title={<MemberRateTitle/>}>
        <MemberRateForm/>
    </Edit>
);

export const MemberRateCreate = props => (
    <Create {...props} title={"Создать Ставку"}>
        <MemberRateForm redirect="list"/>
    </Create>
);
