import {Edit, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'

const AccountLandEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput required/>
                <LandReferenceInput required/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountLandEdit
