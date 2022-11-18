import {Create, SimpleForm} from 'react-admin'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'
import {AccountPerson} from '../types'

const redirect = (_basePath: any, _id: any, data: AccountPerson) => `/${account.name}/${data.account_id}/show`

const AccountPersonCreate = () => {
    return (
        <Create
                title="Привязать лицевой счёт к садоводу"
        >
            <SimpleForm redirect={redirect}>
                <AccountReferenceInput/>
                <PersonReferenceInput/>
            </SimpleForm>
        </Create>
    )
}

export default AccountPersonCreate
