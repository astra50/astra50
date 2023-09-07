import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const GateOpenReasonReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

GateOpenReasonReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

export const GateOpenReasonReferenceInput = (props: Partial<ReferenceInputProps>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label}/>
    </ReferenceInput>
)

GateOpenReasonReferenceInput.defaultProps = {
    label: defaults.label,
}
