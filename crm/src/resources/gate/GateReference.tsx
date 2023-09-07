import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const GateReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

GateReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

export const GateReferenceInput = (props: Partial<ReferenceInputProps>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label}/>
    </ReferenceInput>
)

GateReferenceInput.defaultProps = {
    label: defaults.label,
}
