import {Edit, NumberInput, required, SimpleForm, TextInput} from 'react-admin'
import {CctvReferenceInput} from '../cctv/CctvReference'
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
            redirect="show"
        >
            <SimpleForm>
                <NumberInput source="number" label="Номер"/>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
                <NumberInput
                    label="Задержка"
                    helperText="Задержка между открытиями"
                    source="delay"
                    validate={required()}
                />
                <TextInput source="coordinates" label="Координаты"/>
                <CctvReferenceInput/>
            </SimpleForm>
        </Edit>
    )
}

export default GateEdit
