import {DateInput, Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'

const MemberPaymentEdit = () => {
    return (
        <Edit  title="Членский Взнос">
            <SimpleForm>
                <AccountReferenceInput/>
                <PersonReferenceInput label="Плательщик" fullWidth/>
                <MoneyInput
                    source="amount"
                    label="Сумма"
                    validate={required()}
                />
                <ReferenceInput
                    source="land_id"
                    reference="land"
                    label="Участок"
                    perPage={500}
                    sort={{field: 'number', order: 'ASC'}}
                >
                    <SelectInput optionText="number"/>
                </ReferenceInput>
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
