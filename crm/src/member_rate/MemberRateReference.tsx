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
        source="member_rate_id"
        reference={member_rate.name}
        {...props}
    >
        <TextField source="name"/>
    </ReferenceField>
)

export const MemberRateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="member_rate_id"
        reference={member_rate.name}
        filterToQuery={searchText => ({'name': searchText})}
        {...props}
    >
        <AutocompleteInput optionText="name"/>
    </ReferenceInput>
)

MemberRateReferenceField.defaultProps = {
    label: 'Улица',
}
MemberRateReferenceInput.defaultProps = {
    label: 'Улица',
}
