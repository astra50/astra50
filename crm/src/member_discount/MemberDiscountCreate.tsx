import {Create, Identifier, SimpleForm, TextInput} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'

const MemberDiscountCreate = () => {
    return (
        <Create  title="Создать льготника">
            <SimpleForm redirect={(_: string,
                                   __: Identifier,
                                   data: any) => `/${member_rate.name}/${data.rate_id}/show`}>
                <MemberRateReferenceInput label="Ставка" fullWidth/>

                <AccountReferenceInput/>

                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth
                />
            </SimpleForm>
        </Create>
    )
}

export default MemberDiscountCreate
