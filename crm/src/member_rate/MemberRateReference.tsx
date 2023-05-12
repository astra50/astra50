import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    TextField,
} from 'react-admin'
import member_rate from './index'

const defaultLabel = 'Ставка'

export const MemberRateReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        source="rate_id"
        reference={member_rate.name}
        {...props}
    >
        <TextField source="amount" label={props.label ?? defaultLabel}/>
    </ReferenceField>
)

export const MemberRateReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="rate_id"
        reference={member_rate.name}
        {...props}
    >
        <AutocompleteInput
            optionText="amount"
            label={props.label ?? defaultLabel}
            filterToQuery={(searchText: any) => ({'amount': searchText})}
        />
    </ReferenceInput>
)
