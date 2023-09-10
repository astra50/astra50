import {ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps, SelectInput} from 'react-admin'
import defaults from './defaults'

export const GateOpenReasonReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

GateOpenReasonReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const GateOpenReasonReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
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

GateOpenReasonReferenceInput.defaultProps = {
    label: defaults.label,
}
