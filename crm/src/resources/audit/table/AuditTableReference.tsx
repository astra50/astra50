import {AutocompleteInput, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

interface InputProps {
    disabled?: boolean
    fullWidth?: boolean
}

export const AuditTableReferenceInput = (props: InputProps & Partial<ReferenceInputProps>) => {
    const {label, disabled, fullWidth, validate, ...rest} = props

    return <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        sort={{field: 'id', order: 'asc'}}
        {...rest}
    >
        <AutocompleteInput
            filterToQuery={(searchText: any) => ({'id': searchText})}
            style={{width: '300px'}}
            label={label}
            validate={validate}
            disabled={disabled}
            fullWidth={fullWidth}
        />
    </ReferenceInput>
}

AuditTableReferenceInput.defaultProps = {
    label: defaults.label,
}
