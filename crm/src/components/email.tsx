import {TextField, TextInput, TextInputProps} from 'react-admin'

interface InputProps {
    source?: string,
}

export const EmailInput = (props: InputProps & Omit<Omit<TextInputProps, 'source'>, 'reference' | 'children'>) => (
    <TextInput source="email" label={props.label ?? 'Электронный адрес'}/>
)

interface FieldProps {
    source?: string,
}

export const EmailField = (props: FieldProps & Omit<Omit<TextInputProps, 'source'>, 'reference' | 'children'>) => (
    <TextField source="email" label={props.label ?? 'Электронный адрес'}/>
)
