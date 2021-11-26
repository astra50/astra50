import {Edit, EditProps, required, SimpleForm, TextInput} from 'react-admin'
import {Gate} from '../types'

interface GateTitleProps {
    record?: Gate;
}

const GateTitle = ({record}: GateTitleProps) => record ?
    <span>Ворота {record.name}</span> : null

const GateEdit = (props: EditProps) => {
    return (
        <Edit {...props} title={<GateTitle/>}>
            <SimpleForm>
                <TextInput
                    source="name"
                    validate={required()}
                    label="Название"
                />
                <TextInput source="phone" label="Телефон"/>
            </SimpleForm>
        </Edit>
    )
}

export default GateEdit
