import {
    AutocompleteArrayInput,
    BooleanInput,
    Edit,
    FieldProps,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin'
import {MoneyInput} from '../money'
import {Target} from '../types'

const Title = (props: FieldProps<Target>) => {
    const {record} = props

    return <span>Цель {record ? `"${record.name}"` : ''}</span>
}

const TargetEdit = () => {
    return (
        <Edit
            title={<Title/>}>
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
