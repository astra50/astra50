import {DateInput, Edit, SimpleForm, TextInput, WithRecord} from 'react-admin'
import {CommentInput} from '../components/comment'
import {PersonPhoneReferenceInput} from '../person_phone/PersonPhoneReference'
import {UsersReferenceInput} from '../user/UserReference'
import {PersonField} from './PersonField'

const PersonEdit = () => {
    return (
        <Edit
            title={<PersonField/>}
            redirect="show"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput source="lastname" label="Фамилия"/>
                <TextInput source="firstname" label="Имя"/>
                <TextInput source="middlename" label="Отчество"/>
                <WithRecord render={function (record) {
                    return <PersonPhoneReferenceInput person_id={record.id as string}/>
                }}/>
                <TextInput source="telegram_id" label="Телеграм ID"/>
                <UsersReferenceInput/>
                <CommentInput/>
                <DateInput source="entered_at" label="Дата вступления"/>
                <TextInput source="entered_document" label="Документ вступления"/>
                <TextInput
                    source="registration_address"
                    label="Адрес регистрации"
                    fullWidth
                />
                <TextInput
                    source="passport_serial"
                    label="Серия паспорта"
                    fullWidth
                />
                <TextInput
                    source="passport_number"
                    label="Номер паспорта"
                    fullWidth
                />
                <TextInput
                    source="passport_issued_by"
                    label="Кем выдан паспорт"
                    fullWidth
                />
                <DateInput
                    source="passport_issued_date"
                    label="Дата выдачи паспорта"
                    fullWidth
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextInput
                    source="passport_issued_code"
                    label="Код подразделения"
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    )
}

export default PersonEdit
