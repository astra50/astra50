import {DateInput, Edit, NumberInput, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {MoneyInput} from '../../components/money'

const MemberRateEdit = () => {
    return (
        <Edit
            redirect="show"
            mutationMode="pessimistic"
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
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default MemberRateEdit
