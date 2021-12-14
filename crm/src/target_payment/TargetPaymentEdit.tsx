import {DateInput, Edit, EditProps, required, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'
import {PersonReferenceField, PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceInput} from '../target/TargetReference'

const TargetPaymentEdit = (props: EditProps) => {
    return (
        <Edit {...props} title="Целевой взнос">
            <SimpleForm>
                <PersonReferenceInput label="Плательщик"/>
                <TargetReferenceInput/>
                <MoneyInput
                    source="amount"
                    label="Сумма"
                    validate={required()}
                />
                <PersonReferenceField label="Плательщик"/>
                <DateInput
                    source="paid_at"
                    label="Дата платежа"
                    validate={required()}
                    initialValue={new Date()}
                />
                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    )
}

export default TargetPaymentEdit
