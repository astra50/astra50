import {ListProps} from 'ra-ui-materialui/lib/types'
import {
    Create,
    CreateProps,
    Datagrid,
    Edit,
    EditButton,
    EditProps,
    FieldProps,
    List,
    NumberField,
    NumberInput,
    Pagination,
    PaginationProps,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin'
import {Land} from '../types'

const landFilters = [
    <ReferenceInput source="street_id" label="Улица" reference="street" allowEmpty>
        <SelectInput optionText="name"/>
    </ReferenceInput>,
]

const LandPagination = (props: PaginationProps) => <Pagination rowsPerPageOptions={[50, 100, 150, 200]} {...props} />

export const LandList = (props: ListProps) => (
    <List {...props}
          title={'Участки'}
          filters={landFilters}
          sort={{field: 'number', order: 'ASC'}}
          pagination={<LandPagination/>}
          perPage={50}
          empty={false}
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
)


const LandTitle = (props: FieldProps<Land>) => {
    const {record} = props

    return <span>Участок {record ? `"${record.number}"` : ''}</span>
}

export const LandEdit = (props: EditProps) => (
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
)

export const LandCreate = (props: CreateProps) => (
    <Create {...props} title={'Создать участок'}>
        <SimpleForm redirect="list">
            <ReferenceInput source="street_id" reference="street" label="Улица">
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <NumberInput source="number" label="Номер"/>
            <NumberInput source="square" label="Площадь"/>
            <TextInput source="cadastral_number" label="Кадастровый номер"/>
        </SimpleForm>
    </Create>
)
