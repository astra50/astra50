import {
    AutocompleteInput,
    FieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import {Person} from '../../types'

const defaultReference = 'person'
const defaultSource = 'person_id'

export const PersonReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaultReference}
        source={props.source ?? defaultSource}
        {...props}
    >
        <TextField source="full_name" label={props.label}/>
    </ReferenceField>
)

PersonReferenceField.defaultProps = {
    label: 'Садовод',
    link: 'show',
}

interface PersonReferenceInputProps {
    required?: boolean,
}

export const PersonReferenceInput = (props: PersonReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={props.reference ?? defaultReference}
        source={props.source ?? defaultSource}
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
    label: 'Садовод',
    fullWidth: true,
    allowEmpty: true,
}
