import {
    AutocompleteArrayInput,
    BooleanInput,
    Create,
    ReferenceArrayInput,
    required,
    SimpleForm,
    TextInput,
} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {MoneyInput} from '../../components/money'

const TargetCreate = () => {
    return (
        <Create
            redirect="show"
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
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default TargetCreate
