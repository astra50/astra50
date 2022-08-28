import {DateInput, Edit, EditProps, FieldProps, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'
import {MemberRate} from '../types'

const Title = (props: FieldProps<MemberRate>) => {
    const {record} = props

    return <span>Ставка с {record ? `${record.since} по ${record.until}` : ''}</span>
}

const MemberRateEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <MoneyInput
                    source="amount"
                    label="Ставка"
                    helperText="Ставка за сотку"
                    validate={required()}
                />
                <NumberInput
                    source="discount"
                    label="Скидка"
                    helperText="Процент"
                />
                <div>
                    <DateInput
                        source="since"
                        label="С даты"
                        helperText="Дата начала действия ставки"
                        validate={required()}
                    />
                    <DateInput
                        source="until"
                        label="По дату"
                        helperText="Дата завершения действия ставки НЕ включительно"
                        validate={required()}
                    />
                </div>
                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth={true}
                />
            </SimpleForm>
        </Edit>
    )
}

export default MemberRateEdit
