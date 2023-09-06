import {Edit, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {LandReferenceInput} from '../land/LandReference'

const Title = () => {
    return <span>Связь Лицевой счёт - Участок</span>
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
