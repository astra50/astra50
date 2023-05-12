import {AutocompleteArrayInput, BooleanInput, Edit, ReferenceArrayInput, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'

const TargetEdit = () => {
    return (
        <Edit
            title="Редактирование цели"
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
        </Edit>
    )
}

export default TargetEdit
