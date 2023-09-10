import {Edit, required, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountPersonEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput validate={required()}/>
                <PersonReferenceInput validate={required()}/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountPersonEdit
