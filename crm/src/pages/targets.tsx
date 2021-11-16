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
} from 'react-admin';
import {ListProps} from "ra-ui-materialui/lib/types";
import {Target} from "../types";

export const TargetList = (props: ListProps) => (
    <List {...props}
          title="Цели"
          empty={false}
    >
        <Datagrid>
            <TextField source="name" label="Цель"/>
            <TextField source="comment" label="Комментарий"/>
            <EditButton/>
        </Datagrid>
    </List>
);

const TargetTitle = (props: FieldProps<Target>) => {
    const {record} = props

    return <span>Цель {record ? `"${record.name}"` : ''}</span>;
};

export const TargetEdit = (props: EditProps) => (
    <Edit {...props} title={<TargetTitle/>}>
        <SimpleForm>
            <TextInput source="name" label="Цель"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Edit>
);

export const TargetCreate = (props: CreateProps) => (
    <Create {...props} title={"Создать Ставку"}>
        <SimpleForm redirect="list">
            <TextInput source="name" label="Цель"/>
            <TextInput source="comment" label="Комментарий"/>
        </SimpleForm>
    </Create>
);
