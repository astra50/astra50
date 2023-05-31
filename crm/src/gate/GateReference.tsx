import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import gate from './index'

const defaultSource = 'gate_id'
const defaultLabel = 'Ворота'

export const GateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={defaultSource}
        reference={gate.name}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label ?? defaultLabel}/>
    </ReferenceInput>
)

GateReferenceInput.defaultProps = {
    label: 'Ворота',
}

export const GateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={defaultSource}
        reference={gate.name}
        link="show"
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

GateReferenceField.defaultProps = {
    label: defaultLabel,
}
