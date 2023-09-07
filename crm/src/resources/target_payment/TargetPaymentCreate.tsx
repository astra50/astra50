import {Create, DateInput, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {ContractorReferenceInput} from '../contractor/ContractorReference'
import {LandReferenceInput} from '../land/LandReference'
import {MoneyInput} from '../../components/money'
import {PersonReferenceInput} from '../person/PersonReference'
import {TargetReferenceInput} from '../target/TargetReference'

const TargetPaymentCreate = () => {
    return (
        <Create
            redirect="show"
        >
            <SimpleForm>
                <TargetReferenceInput required/>
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
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default TargetPaymentCreate
