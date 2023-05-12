import {DateInput, Edit, required, SimpleForm, TextInput} from 'react-admin'
import {ContractorReferenceInput} from '../contractor/ContractorReference'
import {LandReferenceInput} from '../land/LandReference'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceInput} from '../target/TargetReference'

const TargetPaymentEdit = () => {
    return (
        <Edit title="Редактирование Целевого взноса">
            <SimpleForm>
                <TargetReferenceInput/>
                <PersonReferenceInput label="Плательщик"/>
                <ContractorReferenceInput/>
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
                    defaultValue={new Date()}
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
