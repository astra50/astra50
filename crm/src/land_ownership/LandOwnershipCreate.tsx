import {Create, CreateProps, DateInput, SimpleForm} from 'react-admin'
import {LandReferenceInput} from '../land/LandReference'
import {PersonReferenceInput} from '../person/PersonReference'

const LandOwnershipCreate = (props: CreateProps) => {
    return (
        <Create {...props}
                title="Создать владение"
        >
            <SimpleForm redirect="list">
                <LandReferenceInput/>
                <PersonReferenceInput source="owner_id"/>
                <DateInput source="since" label="С даты"/>
                <DateInput source="until" label="По дату"/>
            </SimpleForm>
        </Create>
    )
}

export default LandOwnershipCreate
