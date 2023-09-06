import {Edit, SimpleForm} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {PersonReferenceInput} from '../person/PersonReference'

const Title = () => {
    return <span>Связь Лицевой счёт - Человек</span>
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
