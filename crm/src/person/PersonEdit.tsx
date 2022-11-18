import {Edit, SimpleForm, TextInput} from 'react-admin'
import {PersonField} from './PersonField'

const PersonEdit = () => {
    return (
        <Edit
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
                <TextInput source="comment" label="Комментарий"/>
            </SimpleForm>
        </Edit>
    )
}

export default PersonEdit
