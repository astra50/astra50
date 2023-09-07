import {
    AutocompleteInput,
    FieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const PersonEmailReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="email" label={props.label}/>
    </ReferenceField>
)

PersonEmailReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface InputProps {
    person_id?: string,
}

export const PersonEmailReferenceInput = (props: InputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        filter={{person_id: props.person_id}}
        {...props}
    >
        <AutocompleteInput
            optionText="email"
            matchSuggestion={() => true}
            label={props.label}
            filterToQuery={(searchText: any) => ({'phone': searchText})}
            fullWidth
        />
    </ReferenceInput>
)

PersonEmailReferenceInput.defaultProps = {
    label: defaults.label,
    fullWidth: true,
    allowEmpty: true,
}
