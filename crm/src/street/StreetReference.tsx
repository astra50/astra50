import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
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

export const StreetReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="street_id"
        reference={street.name}
        {...props}
    >
        <SelectInput optionText="name" label={props.label}/>
    </ReferenceInput>
)

StreetReferenceField.defaultProps = {
    label: 'Улица',
}
StreetReferenceInput.defaultProps = {
    label: 'Улица',
}
