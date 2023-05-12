import {
    AutocompleteArrayInput,
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    required,
    SimpleForm,
    TextInput,
} from 'react-admin'
import {CommentField} from '../components/comment'
import {MoneyInput} from '../money'

const TargetEdit = () => {
    return (
        <Edit
            title="Редактирование цели"
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <TextInput
                    label="Название"
                    source="name"
                    validate={required()}
                />
                <BooleanInput
                    label="Публичная?"
                    source="is_public"
                />
                <MoneyInput
                    label="Начальная сумма"
                    source="initial_amount"
                    validate={required()}
                    defaultValue={0}
                />
                <MoneyInput
                    source="total_amount"
                    label="Целевая сумма"
                    validate={required()}
                    defaultValue={0}
                />
                <MoneyInput
                    source="payer_amount"
                    label="Сумма с человека"
                    validate={required()}
                    defaultValue={0}
                />
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
                <CommentField/>
            </SimpleForm>
        </Edit>
    )
}

export default TargetEdit
