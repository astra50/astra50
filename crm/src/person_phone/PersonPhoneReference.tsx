import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import person_phone from './index'

interface FieldProps {
    source?: string,
}

export const PersonPhoneReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={props.source ?? 'phone_id'}
        reference={person_phone.name}
        {...props}
    >
        <TextField source="phone" label={props.label}/>
    </ReferenceField>
)

interface InputProps {
    person_id?: string,
}

export const PersonPhoneReferenceInput = (props: InputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="phone_id"
        reference={person_phone.name}
        filter={{person_id: props.person_id}}
        {...props}
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

PersonPhoneReferenceField.defaultProps = {
    label: 'Телефон',
    link: 'show',
}
PersonPhoneReferenceInput.defaultProps = {
    label: 'Телефон',
    fullWidth: true,
    allowEmpty: true,
}
