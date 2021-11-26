import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'

const label = 'Ворота'
const source = 'gate_id'
const reference = 'gate'

export const GateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        label={label}
        source={source}
        reference={reference}
        {...props}
    >
        <SelectInput optionText="name" source="name"/>
    </ReferenceInput>
)

export const GateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        label={label}
        source={source}
        reference={reference}
        {...props}
    >
        <TextField source="name"/>
    </ReferenceField>
)
