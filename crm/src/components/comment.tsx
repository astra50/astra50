import {TextField, TextFieldProps, TextInput, TextInputProps} from 'react-admin'

const defaultLabel = 'Комментарий'

export const CommentInput = (props: Omit<TextInputProps, 'source'>) => {
    return <TextInput
        source="comment"
        label={props.label ?? defaultLabel}
        multiline={true}
        fullWidth={props.fullWidth ?? true}
        {...props}
    />
}

export const CommentField = (props: Omit<TextFieldProps, 'source'>) => {
    return <TextField
        source="comment"
        {...props}
    />
}

CommentField.defaultProps = {
    label: defaultLabel,
}
