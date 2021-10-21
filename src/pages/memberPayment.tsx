import {
    Create,
    CreateProps,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    EditProps,
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
import {ListProps} from "ra-ui-materialui/lib/types";
import {PersonField} from "./person";

const MemberPaymentFilters = [
    <ReferenceInput
        source="person_id"
        reference="person"
        label="Плательщик"
        perPage={500}
        sort={{field: 'lastname', order: 'ASC'}}
        allowEmpty
    >
        <SelectInput optionText={<PersonField/>}/>
    </ReferenceInput>,
];

export const MemberPaymentList = (props: ListProps) => (
    <List {...props}
          title="Членские взносы"
          empty={false}
          filters={MemberPaymentFilters}
          sort={{field: 'paid_at', order: 'DESC'}}
    >
        <Datagrid>
            <ReferenceField source="person_id" reference="person" label="Плательщик">
                <PersonField/>
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

const MemberPaymentForm = () => (
    <>
        <ReferenceInput
            source="person_id"
            reference="person"
            label="Плательщик"
            perPage={500}
            sort={{field: 'lastname', order: 'ASC'}}
        >
            <SelectInput optionText={<PersonField withPhone={true}/>}/>
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
    </>
)

export const MemberPaymentEdit = (props: EditProps) => (
    <Edit {...props} title="Членский Взнос">
        <SimpleForm>
            <MemberPaymentForm/>
        </SimpleForm>
    </Edit>
)

export const MemberPaymentCreate = (props: CreateProps) => (
    <Create {...props} title={"Создать платёж"}>
        <SimpleForm redirect="list">
            <MemberPaymentForm/>
        </SimpleForm>
    </Create>
)
