import {Create, CreateProps, DateInput, required, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'

const MemberRateCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать Ставку"
        >
            <SimpleForm redirect="list">
                <MoneyInput
                    source="amount"
                    label="Ставка"
                    helperText="Ставка за сотку"
                    validate={required()}
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
        </Create>
    )
}

export default MemberRateCreate
