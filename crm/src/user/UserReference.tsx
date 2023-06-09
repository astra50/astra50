import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
    TextField,
} from 'react-admin'
import user from './index'

const defaultLabel = 'Пользователь'
const defaultSource = 'user_id'

interface InputFieldProps {
}

export const UsersReferenceField = (props: InputFieldProps & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => {
    return (
        <ReferenceField
            source={defaultSource}
            reference={user.name}
            link="show"
            {...props}
        >
            <TextField source="username"/>
        </ReferenceField>
    )
}
UsersReferenceField.defaultProps = {
    label: defaultLabel,
}

interface UsersReferenceInputProps {
    required?: boolean,
}

export const UsersReferenceInput = (props: UsersReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source={defaultSource}
        reference={user.name}
        {...props}
    >
        <AutocompleteInput
            optionText="username"
            label={props.label ?? defaultLabel}
            filterToQuery={(searchText: any) => ({'username': searchText})}
            validate={props.required ? required() : []}
            fullWidth
        />
    </ReferenceInput>
)
