import {
    AutocompleteInput,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    required,
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

interface MemberRateReferenceInputProps {
    required?: boolean,
}

export const MemberRateReferenceInput = (props: MemberRateReferenceInputProps & Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="rate_id"
        reference={member_rate.name}
        {...props}
    >
        <AutocompleteInput
            optionText="amount"
            label={props.label ?? defaultLabel}
            filterToQuery={(searchText: any) => ({'amount': searchText})}
            validate={props.required ? required() : []}
        />
    </ReferenceInput>
)
