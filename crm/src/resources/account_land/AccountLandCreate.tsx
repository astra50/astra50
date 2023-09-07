import {Create, Identifier, RaRecord, SimpleForm} from 'react-admin'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {AccountLand} from '../../types'

const AccountLandCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as AccountLand

                return `${account.name}/${record.account_id}/show`
            }}
        >
            <SimpleForm>
                <AccountReferenceInput required/>
                <LandReferenceInput required/>
            </SimpleForm>
        </Create>
    )
}

export default AccountLandCreate
