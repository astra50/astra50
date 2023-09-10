import {Create, Identifier, RaRecord, required, SimpleForm} from 'react-admin'
import {AccountPerson} from '../../types'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'

const AccountPersonCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as AccountPerson

                return `${account.name}/${record.account_id}/show`
            }}
        >
            <SimpleForm>
                <AccountReferenceInput validate={required()}/>
                <PersonReferenceInput validate={required()}/>
            </SimpleForm>
        </Create>
    )
}

export default AccountPersonCreate
