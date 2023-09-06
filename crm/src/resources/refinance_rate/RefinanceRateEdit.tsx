import {DateInput, Edit, FieldProps, NumberInput, required, SimpleForm} from 'react-admin'
import {RefinanceRate} from '../../types'

const Title = (props: FieldProps<RefinanceRate>) => {
    const {record} = props

    return <span>Ставка {record ? `"${record.rate} от ${record.since}"` : ''}</span>
}

const RefinanceRateEdit = () => {
    return (
        <Edit
            title={<Title/>}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <NumberInput source="rate" label="Ставка" validate={required()}/>
                <DateInput source="since" label="Дата" validate={required()}/>
            </SimpleForm>
        </Edit>
    )
}

export default RefinanceRateEdit
