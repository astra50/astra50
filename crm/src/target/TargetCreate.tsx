import {Create, CreateProps, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'

const TargetCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать Ставку">
            <SimpleForm redirect="list">
                <TextInput source="name" label="Цель"/>
                <TextInput source="comment" label="Комментарий"/>
                <MoneyInput source="initial_amount" label="Начальная сумма"/>
                <MoneyInput source="total_amount" label="Целевая сумма"/>
                <MoneyInput source="payer_amount" label="Сумма с человека"/>
            </SimpleForm>
        </Create>
    )
}

export default TargetCreate
