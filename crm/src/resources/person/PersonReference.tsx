import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import {Person} from '../../types'
import person from './index'
import {PersonFieldProps} from './PersonField'

export const PersonReferenceField = (props: PersonFieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="person_id"
        reference={person.name}
        {...props}
    >
        <TextField source="full_name" label={props.label}/>
    </ReferenceField>
)

interface PersonReferenceInputProps {
    required?: boolean,
}

export const PersonReferenceInput = (props: PersonReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="person_id"
        reference={person.name}
        {...props}
    >
        <AutocompleteInput
            optionText="full_name"
            inputText={(record: Person) => record.full_name}
            matchSuggestion={() => true}
            label={props.label}
            filterToQuery={(searchText: any) => ({'firstname,lastname,middlename,phones#phone@_ilike,emails#email@_ilike,telegram_id': searchText})}
            validate={props.required ? required() : []}
            fullWidth
        />
    </ReferenceInput>
)

PersonReferenceField.defaultProps = {
    label: 'Садовод',
    link: 'show',
}
PersonReferenceInput.defaultProps = {
    label: 'Садовод',
    fullWidth: true,
    allowEmpty: true,
}
