import {Create, DateInput, SimpleForm, TextInput} from 'react-admin'

const PersonCreate = () => {
    return (
        <Create
            title="Создать садовода"
            redirect="list"
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
                <DateInput source="entered_at" label="Дата вступления"/>
                <TextInput source="entered_document" label="Документ вступления"/>
            </SimpleForm>
        </Create>
    )
}

export default PersonCreate
