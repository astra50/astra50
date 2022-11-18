import {Datagrid, List, TextField} from 'react-admin'

const GateList = () => {
    return (
        <List
            title="Ворота"
            sort={{field: 'number', order: 'ASC'}}

        >
            <Datagrid rowClick="edit">
                <TextField
                    source="name"
                    label="Название"
                />
                <TextField
                    source="phone"
                    label="Телефон"
                />
            </Datagrid>
        </List>
    )
}

export default GateList
