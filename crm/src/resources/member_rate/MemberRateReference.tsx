import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const MemberRateReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

MemberRateReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const MemberRateReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {label, disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            {...rest}
        >
            <AutocompleteInput
                filterToQuery={(searchText: any) => ({'amount': searchText})}
                label={label}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

MemberRateReferenceInput.defaultProps = {
    label: defaults.label,
}
