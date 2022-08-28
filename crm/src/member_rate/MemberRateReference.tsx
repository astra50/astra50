import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import member_rate from './index'

export const MemberRateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="rate_id"
        reference={member_rate.name}
        {...props}
    >
        <TextField source="amount"/>
    </ReferenceField>
)

export const MemberRateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="rate_id"
        reference={member_rate.name}
        filterToQuery={searchText => ({'amount': searchText})}
        {...props}
    >
        <AutocompleteInput optionText="amount"/>
    </ReferenceInput>
)

MemberRateReferenceField.defaultProps = {
    label: 'Ставка',
}
MemberRateReferenceInput.defaultProps = {
    label: 'Ставка',
}
