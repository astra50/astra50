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
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin'
import {Street} from '../types'

export const StreetList = (props: ListProps) => (
    <List {...props}
          title={'Улицы'}
          empty={false}
    >
        <Datagrid>
            <TextField source="name" label={'Название'}/>
            <EditButton/>
        </Datagrid>
    </List>
)

const StreetTitle = (props: FieldProps<Street>) => {
    const {record} = props

    return <span>Улица {record ? `"${record.name}"` : ''}</span>
}

export const StreetEdit = (props: EditProps) => (
    <Edit {...props} title={<StreetTitle/>}>
        <SimpleForm>
            <TextInput source="name"/>
        </SimpleForm>
    </Edit>
)

export const StreetCreate = (props: CreateProps) => (
    <Create {...props} title={'Создать улицу'}>
        <SimpleForm redirect="list">
            <TextInput source="name" label="Название"/>
        </SimpleForm>
    </Create>
)
