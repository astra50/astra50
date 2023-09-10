import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const PersonPhoneReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        source={defaults.source}
        {...props}
        reference={defaults.reference}
    />
)

PersonPhoneReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    person_id?: string
    disabled?: boolean
    fullWidth?: boolean
}

export const PersonPhoneReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {person_id, label, disabled, fullWidth, validate, ...rest} = props

    return (
        <ReferenceInput
            reference={defaults.reference}
            source={defaults.source}
            filter={{person_id: props.person_id}}
            {...rest}
        >
            <AutocompleteInput
                matchSuggestion={() => true}
                filterToQuery={(searchText: any) => ({'phone': searchText})}
                label={label}
                validate={validate}
                disabled={disabled}
                fullWidth={fullWidth}
            />
        </ReferenceInput>
    )
}

PersonPhoneReferenceInput.defaultProps = {
    label: defaults.label,
    fullWidth: true,
}
