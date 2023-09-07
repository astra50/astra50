import {Create, DateInput, NumberInput, required, SimpleForm} from 'react-admin'

const RefinanceRateCreate = () => {
    return (
        <Create
            redirect="show"
        >
            <SimpleForm>
                <NumberInput source="rate" label="Ставка" validate={required()}/>
                <DateInput source="since" label="Дата" validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default RefinanceRateCreate
