import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
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
        <TextField source="number" label={props.label}/>
    </ReferenceField>
)

interface AccountReferenceInputProps {
    required?: boolean,
}

export const AccountReferenceInput = (props: AccountReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="account_id"
        reference={account.name}
        sort={{field: 'number', order: 'ASC'}}
        {...props}
    >
        <AutocompleteInput
            optionText="number"
            label={props.label}
            filterToQuery={(searchText: any) => ({'number@_ilike': searchText})}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)

AccountReferenceField.defaultProps = {
    label: 'Лицевой счёт',
}
AccountReferenceInput.defaultProps = {
    label: 'Лицевой счёт',
}
