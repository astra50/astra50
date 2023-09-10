import {Create, Identifier, RaRecord, required, SimpleForm} from 'react-admin'
import {AccountLand} from '../../types'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'

const AccountLandCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as AccountLand

                return `${account.name}/${record.account_id}/show`
            }}
        >
            <SimpleForm>
                <AccountReferenceInput validate={required()}/>
                <LandReferenceInput validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default AccountLandCreate
