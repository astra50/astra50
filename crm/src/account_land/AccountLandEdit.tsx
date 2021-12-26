import {Edit, EditProps, FieldProps, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'
import {AccountLand} from '../types'

const Title = (props: FieldProps<AccountLand>) => {
    const {record} = props

    return <span>Лицевой счёт {record ? `"${record.number}"` : ''}</span>
}

const AccountLandEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}
        >
            <SimpleForm>
                <AccountReferenceInput/>
                <LandReferenceInput/>
            </SimpleForm>
        </Edit>
    )
}

export default AccountLandEdit
