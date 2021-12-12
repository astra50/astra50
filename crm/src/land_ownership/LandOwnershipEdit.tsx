import {DateInput, Edit, EditProps, SimpleForm} from 'react-admin'
import {LandReferenceInput} from '../land/LandReference'
import {PersonReferenceInput} from '../person/PersonReference'

const LandOwnershipEdit = (props: EditProps) => {
    return (
        <Edit {...props}
        >
            <SimpleForm>
                <LandReferenceInput/>
                <PersonReferenceInput source="owner_id"/>
                <DateInput source="since" label="С даты"/>
                <DateInput source="until" label="По дату"/>
            </SimpleForm>
        </Edit>
    )
}

export default LandOwnershipEdit
