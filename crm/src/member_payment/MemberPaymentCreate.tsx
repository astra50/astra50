import {
    Create,
    CreateProps,
    DateInput,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
} from 'react-admin'
import {MoneyInput} from '../money'
import {PersonReferenceInput} from '../person/PersonReference'

const MemberPaymentCreate = (props: CreateProps) => {
    return (
        <Create {...props} title="Создать платёж">
            <SimpleForm redirect="list">
                <PersonReferenceInput fullWidth/>
                <div>
                    <MoneyInput
                        source="amount"
                        label="Сумма"
                        validate={required()}
                    />
                </div>

                <div>
                    <ReferenceInput
                        source="land_id"
                        reference="land"
                        label="Участок"
                        perPage={500}
                        sort={{field: 'number', order: 'ASC'}}
                    >
                        <SelectInput optionText="number"/>
                    </ReferenceInput>
                </div>

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

export default MemberPaymentCreate
