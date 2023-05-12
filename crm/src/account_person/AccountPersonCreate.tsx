import {Create, Identifier, RaRecord, SimpleForm} from 'react-admin'
import account from '../account'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'
import {AccountPerson} from '../types'

const AccountPersonCreate = () => {
    return (
        <Create
            title="Привязать лицевой счёт к садоводу"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as AccountPerson

                return `/${account.name}/${record.account_id}/show`
            }}
        >
            <SimpleForm>
                <AccountReferenceInput required/>
                <PersonReferenceInput required/>
            </SimpleForm>
        </Create>
    )
}

export default AccountPersonCreate
