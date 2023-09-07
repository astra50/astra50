import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const AccountReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="number" label={props.label}/>
    </ReferenceField>
)

AccountReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface AccountReferenceInputProps {
    required?: boolean,
}

export const AccountReferenceInput = (props: AccountReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
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

AccountReferenceInput.defaultProps = {
    label: defaults.label,
}
