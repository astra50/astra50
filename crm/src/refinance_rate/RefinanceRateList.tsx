import {Datagrid, DateField, List, NumberField} from 'react-admin'

const RefinanceRateList = () =>
    <List
        title="Ставки рефинансирования"
        empty={false}
        sort={{field: 'since', order: 'DESC'}}
    >
        <Datagrid
            rowClick="edit"
            bulkActionButtons={false}
        >
            <NumberField source="rate" label="Ставка"/>
            <DateField source="since" label="Дата"/>
        </Datagrid>
    </List>

export default RefinanceRateList
