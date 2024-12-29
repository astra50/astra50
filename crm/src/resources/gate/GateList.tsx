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
import {CctvReferenceField} from '../cctv/CctvReference'

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
            empty={false}
            sort={{field: 'number', order: 'ASC'}}
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                rowClick="show"
                omit={[
                    'cctv_id',
                    'cctv_preview_rate',
                    'ha_entity_id',
                    'created_at',
                    'updated_at',
                ]}
            >
                <TextField source="name" label="Название"/>
                <NumberField source="number" label="Номер"/>
                <TextField source="phone" label="Телефон"/>
                <NumberField source="delay" label="Задержка"/>
                <CctvReferenceField source="cctv_id"/>
                <NumberField source="cctv_preview_rate" label="Частота обновления превью видеокамеры"/>
                <TextField source="ha_entity_id" label="HA Entity ID"/>

                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </DatagridConfigurable>
        </List>
    )
}

export default GateList
