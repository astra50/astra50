import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import gateOpenLogReason from './index'

export const GateOpenReasonReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={'reason_id'}
        reference={gateOpenLogReason.name}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label}/>
    </ReferenceInput>
)

GateOpenReasonReferenceInput.defaultProps = {
    label: 'Причина',
}

export const GateOpenReasonReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={'reason_id'}
        reference={gateOpenLogReason.name}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

GateOpenReasonReferenceField.defaultProps = {
    label: 'Причина',
}
