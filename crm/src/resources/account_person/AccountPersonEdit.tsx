import {Edit, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountPersonEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput required/>
                <PersonReferenceInput required/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountPersonEdit
