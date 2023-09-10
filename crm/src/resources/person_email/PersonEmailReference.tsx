import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const PersonEmailReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    />
)

PersonEmailReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    person_id?: string
    disabled?: boolean
    fullWidth?: boolean
}

export const PersonEmailReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
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

PersonEmailReferenceInput.defaultProps = {
    label: defaults.label,
    fullWidth: true,
}
