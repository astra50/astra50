import {Create, DateInput, required, SimpleForm, TextInput} from 'react-admin'
import {ContractorReferenceInput} from '../contractor/ContractorReference'
import {LandReferenceInput} from '../land/LandReference'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceInput} from '../target/TargetReference'

const TargetPaymentCreate = () => {
    return (
        <Create
            title="Создать целевой взнос"
            redirect="list"
        >
            <SimpleForm>
                <PersonReferenceInput label="Плательщик"/>
                <TargetReferenceInput/>
                <LandReferenceInput/>
                <ContractorReferenceInput/>
                <MoneyInput
                    source="amount"
                    label="Сумма"
                    validate={required()}
                />
                <DateInput
                    source="paid_at"
                    label="Дата платежа"
                    validate={required()}
                    defaultValue={new Date()}
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
