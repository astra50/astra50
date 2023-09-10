import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const TargetReferenceField = (props: Partial<ReferenceFieldProps>) => {
    return (
        <ReferenceField
            reference={defaults.reference}
            source={defaults.source}
            {...props}
        />
    )
}

TargetReferenceField.defaultProps = {
    label: defaults.label,
}

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const TargetReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            {...rest}
        >
            <AutocompleteInput
                filterToQuery={(searchText: any) => ({'name,comment': searchText})}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

TargetReferenceInput.defaultProps = {
    label: defaults.label,
}
