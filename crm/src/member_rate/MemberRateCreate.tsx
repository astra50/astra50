import {Create, DateInput, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'

const MemberRateCreate = () => {
    return (
        <Create
            title="Создать Ставку"
            redirect="list"
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
                    validate={required()}
                    defaultValue={0}
                />
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

                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth={true}
                />
            </SimpleForm>
        </Create>
    )
}

export default MemberRateCreate
