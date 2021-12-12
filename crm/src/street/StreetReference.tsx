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
        <TextField source="name"/>
    </ReferenceField>
)

export const StreetReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="street_id"
        reference={street.name}
        filterToQuery={searchText => ({'name': searchText})}
        {...props}
    >
        <SelectInput optionText="name"/>
    </ReferenceInput>
)

StreetReferenceField.defaultProps = {
    label: 'Улица',
}
StreetReferenceInput.defaultProps = {
    label: 'Улица',
}
