import {Create, CreateProps, DateInput, required, SimpleForm, TextInput} from 'react-admin'
import {LandReferenceInput} from '../land/LandReference'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceInput} from '../target/TargetReference'

const TargetPaymentCreate = (props: CreateProps) => {
    return (
        <Create {...props} title="Создать целевой взнос">
            <SimpleForm redirect="list">
                <PersonReferenceInput label="Плательщик"/>
                <TargetReferenceInput/>
                <LandReferenceInput/>
                <MoneyInput
                    source="amount"
                    label="Сумма"
                    validate={required()}
                />
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
        </Create>
    )
}

export default TargetPaymentCreate
