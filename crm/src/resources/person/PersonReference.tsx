import {
    AutocompleteInput, FieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import {Person} from '../../types'
import defaults from './defaults'

export const PersonReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="full_name" label={props.label}/>
    </ReferenceField>
)

PersonReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface PersonReferenceInputProps {
    required?: boolean,
}

export const PersonReferenceInput = (props: PersonReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <AutocompleteInput
            optionText="full_name"
            inputText={(record: Person) => record.full_name ?? record.id}
            matchSuggestion={() => true}
            label={props.label}
            filterToQuery={(searchText: any) => ({'firstname,lastname,middlename,phones#phone@_ilike,emails#email@_ilike,telegram_id': searchText})}
            validate={props.required ? required() : []}
            fullWidth
        />
    </ReferenceInput>
)

PersonReferenceInput.defaultProps = {
    label: defaults.label,
    fullWidth: true,
    allowEmpty: true,
}
