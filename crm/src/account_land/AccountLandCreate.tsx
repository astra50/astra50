import {Create, Identifier, RaRecord, SimpleForm} from 'react-admin'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {AccountLand} from '../types'

const AccountLandCreate = () => {
    return (
        <Create
            title="Привязать лицевой счёт к участку"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as AccountLand

                return `/${account.name}/${record.account_id}/show`
            }}
        >
            <SimpleForm>
                <AccountReferenceInput/>
                <LandReferenceInput/>
            </SimpleForm>
        </Create>
    )
}

export default AccountLandCreate
