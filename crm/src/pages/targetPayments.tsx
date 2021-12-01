import {ListProps} from 'ra-ui-materialui/lib/types'
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
    ReferenceField,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin'
import {MoneyField, MoneyInput} from '../money'
import {PersonField} from './person'

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
]

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
            <ReferenceField source="person_id" reference="person" label="Плательщик" link={'show'}>
                <PersonField/>
            </ReferenceField>
            <MoneyField
                source="amount"
                label="Сумма"
            />
            <DateField source="paid_at" label="Дата"/>
            <TextField source="comment" label="Комментарий"/>
            <EditButton/>
        </Datagrid>
    </List>
)

const TargetForm = () => (
    <>
        <div>
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
        </div>
        <div>
            <MoneyInput
                source="amount"
                label="Сумма"
                validate={required()}
            />
        </div>
        <div>
            <ReferenceInput
                source="person_id"
                reference="person"
                label="Плательщик"
                perPage={500}
                sort={{field: 'lastname', order: 'ASC'}}
                validate={required()}
            >
                <SelectInput
                    optionText={<PersonField withPhone={true}/>}
                />
            </ReferenceInput>
        </div>

        <DateInput
            source="paid_at"
            label="Дата платежа"
            validate={required()}
            initialValue={new Date()}
        />

        <div>
            <TextInput
                source="comment"
                label="Комментарий"
                fullWidth
            />
        </div>
    </>
)

export const TargetPaymentEdit = (props: EditProps) => (
    <Edit {...props} title="Целевой взнос">
        <SimpleForm>
            <TargetForm/>
        </SimpleForm>
    </Edit>
)

export const TargetPaymentCreate = (props: CreateProps) => (
    <Create {...props} title={'Создать целевой взнос'}>
        <SimpleForm redirect="list">
            <TargetForm/>
        </SimpleForm>
    </Create>
)
