import {ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps, SelectInput} from 'react-admin'
import defaults from './defaults'

export const StreetReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        source={defaults.source}
        reference={defaults.reference}
        {...props}
    />
)

StreetReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const StreetReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            {...rest}
        >
            <SelectInput
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

StreetReferenceInput.defaultProps = {
    label: defaults.label,
}
