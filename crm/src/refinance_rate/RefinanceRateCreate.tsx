import {Create, DateInput, NumberInput, SimpleForm} from 'react-admin'

const RefinanceRateCreate = () => {
    return (
        <Create
            title="Создать ставку"
            redirect="list"
        >
            <SimpleForm>
                <NumberInput source="rate" label="Ставка"/>
                <DateInput source="since" label="Дата"/>
            </SimpleForm>
        </Create>
    )
}

export default RefinanceRateCreate
