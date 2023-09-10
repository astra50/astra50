import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const UserReferenceField = (props: Partial<ReferenceFieldProps>) =>
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />

UserReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const UsersReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {label, disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            source={defaults.source}
            reference={defaults.reference}
            {...rest}
        >
            <AutocompleteInput
                filterToQuery={(searchText: any) => ({'username': searchText})}
                label={label}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

UsersReferenceInput.defaultProps = {
    label: defaults.label,
}
