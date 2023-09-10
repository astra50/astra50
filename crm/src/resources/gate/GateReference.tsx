import {ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps, SelectInput} from 'react-admin'
import defaults from './defaults'

export const GateReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

GateReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const GateReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {label, disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            {...rest}
        >
            <SelectInput
                label={label}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

GateReferenceInput.defaultProps = {
    label: defaults.label,
}
