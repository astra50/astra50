import {Edit, FieldProps, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'
import {AccountPerson} from '../../types'

const Title = (props: FieldProps<AccountPerson>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountPersonEdit = () => {
    return (
        <Edit
            title={<Title/>}
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
