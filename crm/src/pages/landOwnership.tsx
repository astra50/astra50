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
    SelectInput,
    SimpleForm,
    TextField,
} from 'react-admin'
import {MoneyField} from '../money'
import {PersonField} from './person'

export const LandOwnershipList = (props: ListProps) => {
    return (
        <List {...props}
              title={'Владение'}
              empty={false}
              sort={{field: 'land.number', order: 'ASC'}}
              perPage={125}
        >
            <Datagrid>
                <ReferenceField source="land_id" reference="land" label="Участок" sortBy="land.number">
                    <TextField source="number"/>
                </ReferenceField>
                <ReferenceField source="owner_id" reference="person" label="Владелец">
                    <PersonField/>
                </ReferenceField>
                <ReferenceField source="owner_id" reference="person" label="Баланс" link={false}>
                    <MoneyField source="balance"/>
                </ReferenceField>
                <DateField source="since" label="С даты"/>
                <DateField source="until" label="По дату"/>
                <EditButton/>
            </Datagrid>
        </List>
    )
}

export const LandOwnershipEdit = (props: EditProps) => (
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
                <SelectInput optionText={<PersonField withPhone={true}/>}/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Edit>
)

export const LandOwnershipCreate = (props: CreateProps) => (
    <Create {...props} title={'Создать владение'}>
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
                <SelectInput optionText={<PersonField withPhone={true}/>}/>
            </ReferenceInput>
            <DateInput source="since" label="С даты"/>
            <DateInput source="until" label="По дату"/>
        </SimpleForm>
    </Create>
)
