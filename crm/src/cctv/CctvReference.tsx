import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import cctv from './index'

const defaultSource = 'cctv_id'
const defaultLabel = 'Видеокамера'

export const CctvReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={defaultSource}
        reference={cctv.name}
        {...props}
    >
        <SelectInput optionText="name" source="name" label={props.label ?? defaultLabel}/>
    </ReferenceInput>
)

CctvReferenceInput.defaultProps = {
    label: defaultLabel,
}

export const CctvReferenceField = (props: Partial<ReferenceFieldProps>) => (
    <ReferenceField
        source={defaultSource}
        reference={cctv.name}
        link="show"
        {...props}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

CctvReferenceField.defaultProps = {
    label: defaultLabel,
}
