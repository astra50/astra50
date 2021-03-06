import {Edit, EditProps, FieldProps, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'
import {AccountPerson} from '../types'

const Title = (props: FieldProps<AccountPerson>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountPersonEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <AccountReferenceInput/>
                <PersonReferenceInput/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountPersonEdit
