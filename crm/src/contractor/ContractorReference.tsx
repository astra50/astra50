import {
    ReferenceField,
    ReferenceFieldProps,
    ReferenceInput,
    ReferenceInputProps,
    SelectInput,
    TextField,
} from 'react-admin'
import contractor from './index'

export const ContractorReferenceField = (props: Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceField
        {...props}
        source="contractor_id"
        reference={contractor.name}
    >
        <TextField source="name" label={props.label}/>
    </ReferenceField>
)

export const ContractorReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="contractor_id"
        reference={contractor.name}
        filterToQuery={(searchText: any) => ({'name': searchText})}
        {...props}
    >
        <SelectInput optionText="name" label={props.label}/>
    </ReferenceInput>
)

ContractorReferenceField.defaultProps = {
    label: 'Контрагент',
}
ContractorReferenceInput.defaultProps = {
    label: 'Контрагент',
    allowEmpty: true,
}
