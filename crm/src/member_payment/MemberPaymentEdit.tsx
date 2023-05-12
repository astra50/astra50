import {DateInput, Edit, required, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {CommentInput} from '../components/comment'
import {LandReferenceInput} from '../land/LandReference'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'

const MemberPaymentEdit = () => {
    return (
        <Edit
            title="Членский Взнос"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput required/>
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
        </Edit>
    )
}

export default MemberPaymentEdit
