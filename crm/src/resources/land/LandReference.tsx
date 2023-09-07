import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    SelectInput,
    TextField,
} from 'react-admin'
import defaults from './defaults'

export const LandReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <TextField source="number" label={props.label}/>
    </ReferenceField>
)

LandReferenceField.defaultProps = {
    label: defaults.label,
    link: defaults.link,
}

interface LandReferenceInputProps {
    required?: boolean,
}

export const LandReferenceInput = (props: LandReferenceInputProps & Partial<ReferenceInputProps>) => (
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        sort={{field: 'number_integer', order: 'ASC'}}
        perPage={500}
        {...props}
    >
        <SelectInput
            optionText="number"
            label={props.label}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)

LandReferenceInput.defaultProps = {
    label: defaults.label,
}
