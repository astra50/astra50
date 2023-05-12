import {Edit, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {Gate} from '../types'

interface GateTitleProps {
    record?: Gate;
}

const GateTitle = ({record}: GateTitleProps) => record ?
    <span>Ворота {record.name}</span> : null

const GateEdit = () => {
    return (
        <Edit
            title={<GateTitle/>}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <NumberInput source="number" label="Номер"/>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
                <TextInput source="coordinates" label="Координаты"/>
            </SimpleForm>
        </Edit>
    )
}

export default GateEdit
