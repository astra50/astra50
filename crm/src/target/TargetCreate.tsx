import {AutocompleteArrayInput, BooleanInput, Create, ReferenceArrayInput, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'

const TargetCreate = () => {
    return (
        <Create
            title="Создать Цель"
            redirect="show"
        >
            <SimpleForm>
                <TextInput source="name" label="Цель"/>
                <BooleanInput source="is_public" label="Публичная?"/>
                <TextInput source="comment" label="Комментарий"/>
                <MoneyInput source="initial_amount" label="Начальная сумма"/>
                <MoneyInput source="total_amount" label="Целевая сумма"/>
                <MoneyInput source="payer_amount" label="Сумма с человека"/>
                <ReferenceArrayInput
                    source="lands" reference="land"
                    perPage={200}
                    sort={{field: 'number_integer', order: 'ASC'}}
                >
                    <AutocompleteArrayInput
                        label="Участки"
                        optionText="number"
                        filterToQuery={(searchText: string) => ({'number': searchText})}
                    />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    )
}

export default TargetCreate
