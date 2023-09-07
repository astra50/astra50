import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const MemberRateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="amount" label={props.label}/>
    </ReferenceField>
)

MemberRateReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface MemberRateReferenceInputProps {
    required?: boolean,
}

export const MemberRateReferenceInput = (props: MemberRateReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <AutocompleteInput
            optionText="amount"
            label={props.label}
            filterToQuery={(searchText: any) => ({'amount': searchText})}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)

MemberRateReferenceInput.defaultProps = {
    label: defaults.label,
}
