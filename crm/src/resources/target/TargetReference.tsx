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

export const TargetReferenceField = (props: Partial<ReferenceFieldProps>) => {
    return (
        <ReferenceField
            reference={defaults.reference}
            source={defaults.source}
            {...props}
        >
            <TextField source="name"/>
        </ReferenceField>
    )
}

TargetReferenceField.defaultProps = {
    label: defaults.label,
}

interface TargetReferenceInputProps {
    required?: boolean,
}

export const TargetReferenceInput = (props: TargetReferenceInputProps & Partial<ReferenceInputProps>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <AutocompleteInput
            optionText="name"
            label={props.label}
            filterToQuery={(searchText: any) => ({'name,comment': searchText})}
            validate={props.required ? required() : []}
            fullWidth
        />
    </ReferenceInput>
)

TargetReferenceInput.defaultProps = {
    label: defaults.label,
}
