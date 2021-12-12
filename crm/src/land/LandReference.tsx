import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import land from './index'

export const LandReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="land_id"
        reference={land.name}
        {...props}
    >
        <TextField source="number"/>
    </ReferenceField>
)

export const LandReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="land_id"
        reference={land.name}
        filterToQuery={searchText => ({'street#name,number,cadastral_number': searchText})}
        {...props}
    >
        <SelectInput optionText="number"/>
    </ReferenceInput>
)

LandReferenceField.defaultProps = {
    label: 'Участок',
}
LandReferenceInput.defaultProps = {
    label: 'Участок',
}
