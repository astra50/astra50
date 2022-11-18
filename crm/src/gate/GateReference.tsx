import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import gate from './index'

export const GateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={'gate_id'}
        reference={gate.name}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label}/>
    </ReferenceInput>
)

GateReferenceInput.defaultProps = {
    label: 'Ворота',
}

export const GateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source={'gate_id'}
        reference={gate.name}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

GateReferenceField.defaultProps = {
    label: 'Ворота',
}
