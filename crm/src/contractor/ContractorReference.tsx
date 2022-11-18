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
        <TextField source="name"/>
    </ReferenceField>
)

export const ContractorReferenceInput = (props: Omit<Omit<ReferenceInputProps, 'source'>, 'reference' | 'children'>) => (
    <ReferenceInput
        source="contractor_id"
        reference={contractor.name}
        filterToQuery={searchText => ({'name': searchText})}
        {...props}
    >
        <SelectInput optionText="name"/>
    </ReferenceInput>
)

ContractorReferenceField.defaultProps = {
    label: 'Контрагент',
}
ContractorReferenceInput.defaultProps = {
    label: 'Контрагент',
}
