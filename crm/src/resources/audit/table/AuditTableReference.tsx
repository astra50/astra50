import {AutocompleteInput, ReferenceInput, ReferenceInputProps} from 'react-admin'
import defaults from './defaults'

export const AuditTableReferenceInput = (props: Partial<ReferenceInputProps>) =>
    <ReferenceInput
        reference={defaults.reference}
        source={defaults.source}
        {...props}
    >
        <AutocompleteInput
            optionText="id"
            filterToQuery={(searchText: any) => ({'id': searchText})}
            label={props.label}
            style={{width: '300px'}}
        />
    </ReferenceInput>

AuditTableReferenceInput.defaultProps = {
    label: defaults.label,
}
