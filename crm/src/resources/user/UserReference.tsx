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

export const UserReferenceField = (props: Partial<ReferenceFieldProps>) => {
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

UserReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface UsersReferenceInputProps {
    required?: boolean,
}

export const UsersReferenceInput = (props: UsersReferenceInputProps & Partial<ReferenceInputProps>) => (
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
