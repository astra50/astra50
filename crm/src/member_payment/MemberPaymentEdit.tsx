import {DateInput, Edit, EditProps, ReferenceInput, required, SelectInput, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'

const MemberPaymentEdit = (props: EditProps) => {
    return (
        <Edit {...props} title="Членский Взнос">
            <SimpleForm>
                <PersonReferenceInput fullWidth/>
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

export default MemberPaymentEdit
