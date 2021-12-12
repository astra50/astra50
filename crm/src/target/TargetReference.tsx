import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import target from './index'
import {TargetFieldProps} from './TargetField'

export const TargetReferenceField = (props: TargetFieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="target_id"
        reference={target.name}
        {...props}
    >
        <TextField source="name"/>
    </ReferenceField>
)

export const TargetReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="target_id"
        reference={target.name}
        filterToQuery={searchText => ({'name,comment': searchText})}
        {...props}
    >
        <AutocompleteInput optionText="name"/>
    </ReferenceInput>
)

TargetReferenceField.defaultProps = {
    label: 'Цель',
}
TargetReferenceInput.defaultProps = {
    label: 'Цель',
}
