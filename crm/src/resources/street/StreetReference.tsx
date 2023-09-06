import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    SelectInput,
    TextField,
} from 'react-admin'
import street from './index'

export const StreetReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        {...props}
        source="street_id"
        reference={street.name}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

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

StreetReferenceField.defaultProps = {
    label: 'Улица',
}
StreetReferenceInput.defaultProps = {
    label: 'Улица',
}
