import {Create, SimpleForm} from 'react-admin'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {AccountLand} from '../types'

const redirect = (_basePath: any, _id: any, data: AccountLand) => `/${account.name}/${data.account_id}/show`

const AccountLandCreate = () => {
    return (
        <Create
                title="Привязать лицевой счёт к участку"
        >
            <SimpleForm redirect={redirect}>
                <AccountReferenceInput/>
                <LandReferenceInput/>
            </SimpleForm>
        </Create>
    )
}

export default AccountLandCreate
