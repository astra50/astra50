import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    List,
    NumberField,
    SelectColumnsButton,
    TextField,
    TopToolbar,
} from 'react-admin'

const GateActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <CreateButton/>
    </TopToolbar>
)

const GateList = () => {
    return (
        <List
            actions={<GateActions/>}
            title="Ворота"
            empty={false}
            sort={{field: 'number', order: 'ASC'}}
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                rowClick="show"
                omit={['created_at', 'updated_at']}
            >
                <TextField source="name" label="Название"/>
                <NumberField source="number" label="Номер"/>
                <TextField source="phone" label="Телефон"/>
                <NumberField source="delay" label="Задержка"/>

                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </DatagridConfigurable>
        </List>
    )
}

export default GateList
