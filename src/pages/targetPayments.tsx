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
    required,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import {ListProps} from "ra-ui-materialui/lib/types";
import {PersonField} from "./person";

const TargetPaymentFilters = [
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

export const TargetPaymentList = (props: ListProps) => (
    <List {...props}
          title="Цели"
          empty={false}
          filters={TargetPaymentFilters}
    >
        <Datagrid>
            <ReferenceField source="target_id" reference="target" label="Цель">
                <TextField source="name"/>
            </ReferenceField>
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
);

const TargetForm = () => (
    <>
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
            <SelectInput optionText={<PersonField withPhone={true}/>}/>
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
    </>
);

export const TargetPaymentEdit = (props: EditProps) => (
    <Edit {...props} title="Целевой взнос">
        <SimpleForm>
            <TargetForm/>
        </SimpleForm>
    </Edit>
);

export const TargetPaymentCreate = (props: CreateProps) => (
    <Create {...props} title={"Создать целевой взнос"}>
        <SimpleForm redirect="list">
            <TargetForm/>
        </SimpleForm>
    </Create>
);
