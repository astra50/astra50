import {Datagrid, List, ListProps, TextField} from 'react-admin'

const GateList = (props: ListProps) => {
    return (
        <List
            title="Ворота"
            sort={{field: 'number', order: 'ASC'}}
            {...props}
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
