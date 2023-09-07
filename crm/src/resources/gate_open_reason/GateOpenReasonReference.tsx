import {
    FieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const GateOpenReasonReferenceField = (props: FieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
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

export const GateOpenReasonReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
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
