import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import target from './index'

const defaultLabel = 'Цель'

interface InputFieldProps {
}

export const TargetReferenceField = (props: InputFieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => {
    return (
        <ReferenceField
            source="target_id"
            reference={target.name}
            {...props}
        >
            <TextField source="name"/>
        </ReferenceField>
    )
}
TargetReferenceField.defaultProps = {
    label: defaultLabel,
}

export const TargetReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="target_id"
        reference={target.name}
        {...props}
    >
        <AutocompleteInput
            optionText="name"
            label={props.label ?? defaultLabel}
            filterToQuery={(searchText: any) => ({'name,comment': searchText})}
            fullWidth
        />
    </ReferenceInput>
)
