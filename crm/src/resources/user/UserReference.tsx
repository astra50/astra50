import {
    AutocompleteInput,
    FieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const UsersReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => {
    return (
        <ReferenceField
            reference={defaults.reference}
            source={defaults.source}
            {...props}
        >
            <TextField source="username"/>
        </ReferenceField>
    )
}

UsersReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface UsersReferenceInputProps {
    required?: boolean,
}

export const UsersReferenceInput = (props: UsersReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={defaults.source}
        reference={defaults.reference}
        {...props}
    >
        <AutocompleteInput
            optionText="username"
            label={props.label}
            filterToQuery={(searchText: any) => ({'username': searchText})}
            validate={props.required ? required() : []}
            fullWidth
        />
    </ReferenceInput>
)

UsersReferenceInput.defaultProps = {
    label: defaults.label,
}
