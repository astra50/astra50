import {Datagrid, List, NumberField, TextField} from 'react-admin'

const GateList = () => {
    return (
        <List
            title="Ворота"
            sort={{field: 'number', order: 'ASC'}}
        >
            <Datagrid rowClick="show">
                <TextField source="name" label="Название"/>
                <NumberField source="number" label="Номер"/>
                <TextField source="phone" label="Телефон"/>
                <NumberField source="delay" label="Задержка"/>
            </Datagrid>
        </List>
    )
}

export default GateList
