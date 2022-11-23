import {AutocompleteInput, ReferenceField, ReferenceFieldProps, ReferenceInput, ReferenceInputProps} from 'react-admin'
import {Person} from '../types'
import person from './index'
import {PersonField, PersonFieldProps, personFormat} from './PersonField'

export const PersonReferenceField = (props: PersonFieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="person_id"
        reference={person.name}
        {...props}
    >
        <PersonField withPhone={props.withPhone} label={props.label}/>
    </ReferenceField>
)

export const PersonReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="person_id"
        reference={person.name}
        {...props}
    >
        <AutocompleteInput
            optionText={<PersonField withPhone={true}/>}
            inputText={(record: Person) => personFormat(record, true)}
            matchSuggestion={() => true}
            label={props.label}
            filterToQuery={(searchText: any) => ({'firstname,lastname,middlename,phone,email,telegram_id': searchText})}
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
