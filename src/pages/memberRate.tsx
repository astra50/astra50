import {
    Create,
    CreateProps,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    EditProps,
    FieldProps,
    List,
    NumberField,
    NumberInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import {ListProps} from "ra-ui-materialui/lib/types";
import {MemberRate} from "../types";

export const MemberRateList = (props: ListProps) => (
    <List {...props}
          title="Ставки"
          empty={false}
          sort={{field: 'since', order: 'DESC'}}
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

const MemberRateTitle = (props: FieldProps<MemberRate>) => {
    const {record} = props

    return <span>Ставка с {record ? `"${record.since}" по "${record.until}"` : ''}</span>;
};

const MemberRateForm = () => (
    <span>
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
            helperText="Дата завершения действия ставки НЕ включительно"
        />
        <TextInput source="comment" label="Комментарий"/>
    </span>
);

export const MemberRateEdit = (props: EditProps) => (
    <Edit {...props} title={<MemberRateTitle/>}>
        <SimpleForm>
            <MemberRateForm/>
        </SimpleForm>
    </Edit>
);

export const MemberRateCreate = (props: CreateProps) => (
    <Create {...props} title={"Создать Ставку"}>
        <SimpleForm redirect="list">
            <MemberRateForm/>
        </SimpleForm>
    </Create>
);
