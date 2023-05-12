import {DateInput, Edit, FieldProps, NumberInput, SimpleForm} from 'react-admin'
import {RefinanceRate} from '../types'

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
                <NumberInput source="rate" label="Ставка"/>
                <DateInput source="since" label="Дата"/>
            </SimpleForm>
        </Edit>
    )
}

export default RefinanceRateEdit
