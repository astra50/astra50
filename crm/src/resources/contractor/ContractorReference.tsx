import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const ContractorReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

ContractorReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

export const ContractorReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <SelectInput optionText="name" label={props.label} fullWidth/>
    </ReferenceInput>
)

ContractorReferenceInput.defaultProps = {
    label: defaults.label,
    allowEmpty: true,
}
