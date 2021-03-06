import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import account from './index'

export const AccountReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="account_id"
        reference={account.name}
        link="show"
        {...props}
    >
        <TextField source="number"/>
    </ReferenceField>
)

export const AccountReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="account_id"
        reference={account.name}
        sort={{field: 'number', order: 'ASC'}}
        filterToQuery={searchText => ({'number@_ilike': searchText})}
        {...props}
    >
        <AutocompleteInput
            optionText="number"
        />
    </ReferenceInput>
)

AccountReferenceField.defaultProps = {
    label: 'Лицевой счёт',
}
AccountReferenceInput.defaultProps = {
    label: 'Лицевой счёт',
}
