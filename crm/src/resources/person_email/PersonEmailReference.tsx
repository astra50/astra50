import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import person_email from './index'

interface FieldProps {
    source?: string,
}

export const PersonEmailReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={props.source ?? 'id'}
        reference={person_email.name}
        {...props}
    >
        <TextField source="email" label={props.label}/>
    </ReferenceField>
)

interface InputProps {
    person_id?: string,
}

export const PersonEmailReferenceInput = (props: InputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="phone_id"
        reference={person_email.name}
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

PersonEmailReferenceField.defaultProps = {
    label: 'E-Mail',
    link: 'show',
}
PersonEmailReferenceInput.defaultProps = {
    label: 'E-Mail',
    fullWidth: true,
    allowEmpty: true,
}
