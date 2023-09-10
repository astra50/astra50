import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const AccountReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

AccountReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const AccountReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {label, disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            sort={{field: 'number', order: 'ASC'}}
            {...rest}
        >
            <AutocompleteInput
                filterToQuery={(searchText: any) => ({'number@_ilike': searchText})}
                label={label}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

AccountReferenceInput.defaultProps = {
    label: defaults.label,
}
