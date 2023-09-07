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
import defaults from './defaults'

export const PersonReferenceField = (props: Partial<ReferenceFieldProps>) => (
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

export const PersonReferenceInput = (props: PersonReferenceInputProps & Partial<ReferenceInputProps>) => (
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
