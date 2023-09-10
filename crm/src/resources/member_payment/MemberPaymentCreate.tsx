import {Create, DateInput, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {MoneyInput} from '../../components/money'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {PersonReferenceInput} from '../person/PersonReference'

const MemberPaymentCreate = () => {
    return (
        <Create
            redirect="show"
        >
            <SimpleForm>
                <AccountReferenceInput validate={required()}/>
                <PersonReferenceInput label="Плательщик" fullWidth/>
                <MoneyInput
                    source="amount"
                    label="Сумма"
                    validate={required()}
                />
                <LandReferenceInput/>
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

export default MemberPaymentCreate
