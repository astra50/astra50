import {Datagrid, List, TextField} from 'react-admin'

const CctvList = () => {
    return (
        <List
            title="Видеокамеры"
            sort={{field: 'name', order: 'ASC'}}
        >
            <Datagrid rowClick="show">
                <TextField source="name" label="Название"/>
            </Datagrid>
        </List>
    )
}

export default CctvList
