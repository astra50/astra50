import {Edit, required, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'

const AccountLandEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput validate={required()}/>
                <LandReferenceInput validate={required()}/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountLandEdit
