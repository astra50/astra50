import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    SelectInput,
    TextField,
} from 'react-admin'
import land from './index'

const defaultLabel = 'Участок'

export const LandReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="land_id"
        reference={land.name}
        {...props}
    >
        <TextField source="number" label={props.label}/>
    </ReferenceField>
)
LandReferenceField.defaultProps = {
    label: defaultLabel,
}

interface LandReferenceInputProps {
    required?: boolean,
}

export const LandReferenceInput = (props: LandReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="land_id"
        reference={land.name}
        sort={{field: 'number_integer', order: 'ASC'}}
        perPage={500}
        {...props}
    >
        <SelectInput
            optionText="number"
            label={props.label ?? defaultLabel}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)
LandReferenceInput.defaultProps = {
    label: defaultLabel,
}

