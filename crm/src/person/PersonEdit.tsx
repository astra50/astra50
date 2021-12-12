import {Edit, EditProps, SimpleForm, TextInput} from 'react-admin'
import {PersonField} from './PersonField'

const PersonEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<PersonField/>}
        >
            <SimpleForm>
                <TextInput source="lastname" label="Фамилия"/>
                <TextInput source="firstname" label="Имя"/>
                <TextInput source="middlename" label="Отчество"/>
                <TextInput source="phone" label="Телефон"/>
                <TextInput source="phone_second" label="Телефон2"/>
                <TextInput source="email" label="E-mail"/>
                <TextInput source="telegram_id" label="Телеграм ID"/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonEdit
