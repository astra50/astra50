import {DateInput, Edit, required, SimpleForm, TextInput} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
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
                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    )
}

export default MemberPaymentEdit
