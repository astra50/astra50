import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'
import street from './index'

export const StreetReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={defaults.source}
        reference={defaults.reference}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

StreetReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface StreetReferenceInputProps {
    required?: boolean,
}

export const StreetReferenceInput = (props: StreetReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="street_id"
        reference={street.name}
        {...props}
    >
        <SelectInput
            optionText="name"
            label={props.label}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)

StreetReferenceInput.defaultProps = {
    label: defaults.label,
}
