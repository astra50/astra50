import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import land_ownership from './index'

export const LandOwnershipReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="land_ownership_id"
        reference={land_ownership.name}
        {...props}
    >
        <TextField source="number"/>
    </ReferenceField>
)

export const LandOwnershipReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="land_ownership_id"
        reference={land_ownership.name}
        filterToQuery={searchText => ({'street#name,number,cadastral_number': searchText})}
        {...props}
    >
        <AutocompleteInput optionText="number"/>
    </ReferenceInput>
)

LandOwnershipReferenceField.defaultProps = {
    label: 'Участок',
}
LandOwnershipReferenceInput.defaultProps = {
    label: 'Участок',
}
