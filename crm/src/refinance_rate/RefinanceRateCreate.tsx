import {Create, DateInput, NumberInput, required, SimpleForm} from 'react-admin'

const RefinanceRateCreate = () => {
    return (
        <Create
            title="Создать ставку"
            redirect="list"
        >
            <SimpleForm>
                <NumberInput source="rate" label="Ставка" validate={required()}/>
                <DateInput source="since" label="Дата" validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default RefinanceRateCreate
