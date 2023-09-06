import {Edit, FieldProps, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {AccountLand} from '../../types'

const Title = (props: FieldProps<AccountLand>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountLandEdit = () => {
    return (
        <Edit
            title={<Title/>}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <AccountReferenceInput required/>
                <LandReferenceInput required/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountLandEdit
