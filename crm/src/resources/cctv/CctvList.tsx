import {
    BooleanField,
    CreateButton,
    DatagridConfigurable,
    DateField,
    List,
    SelectColumnsButton,
    TextField,
    TopToolbar,
} from 'react-admin'

const CctvActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <CreateButton/>
    </TopToolbar>
)

const CctvList = () => {
    return (
        <List
            actions={<CctvActions/>}
            sort={{field: 'name', order: 'ASC'}}
            empty={false}
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                rowClick="show"
                omit={[
                    'url',
                    'preview',
                    'created_at',
                    'updated_at',
                ]}
            >
                <TextField source="name" label="Название"/>
                <TextField source="url"/>
                <TextField source="preview"/>
                <BooleanField source="is_enabled"/>

                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </DatagridConfigurable>
        </List>
    )
}

export default CctvList
