import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const PersonPhoneReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        source={defaults.source}
        {...props}
        reference={defaults.reference}
    >
        <TextField source="phone" label={props.label}/>
    </ReferenceField>
)

PersonPhoneReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    person_id?: string,
}

export const PersonPhoneReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => (
    <ReferenceInput
        source={defaults.source}
        filter={{person_id: props.person_id}}
        {...props}
        reference={defaults.reference}
    >
        <AutocompleteInput
            optionText="phone"
            matchSuggestion={() => true}
            label={props.label}
            filterToQuery={(searchText: any) => ({'phone': searchText})}
            fullWidth
        />
    </ReferenceInput>
)

PersonPhoneReferenceInput.defaultProps = {
    label: defaults.label,
    fullWidth: true,
    allowEmpty: true,
}
