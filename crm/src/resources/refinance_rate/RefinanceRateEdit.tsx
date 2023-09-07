import {DateInput, Edit, NumberInput, required, SimpleForm} from 'react-admin'

const RefinanceRateEdit = () => {
    return (
        <Edit
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
