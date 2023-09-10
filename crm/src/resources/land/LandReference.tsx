import {ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps, SelectInput} from 'react-admin'
import defaults from './defaults'

export const LandReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

LandReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const LandReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            sort={{field: 'number_integer', order: 'ASC'}}
            perPage={500}
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

LandReferenceInput.defaultProps = {
    label: defaults.label,
}
