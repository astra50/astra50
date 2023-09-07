import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const CctvReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

CctvReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

export const CctvReferenceInput = (props: Partial<ReferenceInputProps>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label}/>
    </ReferenceInput>
)

CctvReferenceInput.defaultProps = {
    label: defaults.label,
}
