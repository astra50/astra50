import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import gateOpenLogReason from './index'

const label = 'Причина'
const source = 'reason_id'
const reference = gateOpenLogReason.name

export const GateOpenReasonReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        label={label}
        source={source}
        reference={reference}
        {...props}
    >
        <SelectInput optionText="name" source="name"/>
    </ReferenceInput>
)

export const GateOpenReasonReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        {...props}
        label={label}
        source={source}
        reference={reference}
    >
        <TextField source="name"/>
    </ReferenceField>
)
