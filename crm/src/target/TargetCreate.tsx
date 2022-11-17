import {
    AutocompleteArrayInput,
    BooleanInput,
    Create,
    CreateProps,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin'
import {MoneyInput} from '../money'

const TargetCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать Ставку">
            <SimpleForm redirect="show">
                <TextInput source="name" label="Цель"/>
                <BooleanInput source="is_public" label="Публичная?"/>
                <TextInput source="comment" label="Комментарий"/>
                <MoneyInput source="initial_amount" label="Начальная сумма"/>
                <MoneyInput source="total_amount" label="Целевая сумма"/>
                <MoneyInput source="payer_amount" label="Сумма с человека"/>
                <ReferenceArrayInput
                    label="Участки"
                    source="lands" reference="land"
                    filterToQuery={(searchText: string) => ({'number': searchText})}
                    perPage={200}
                    sort={{field: 'number_integer', order: 'ASC'}}
                >
                    <AutocompleteArrayInput optionText="number"/>
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    )
}

export default TargetCreate
