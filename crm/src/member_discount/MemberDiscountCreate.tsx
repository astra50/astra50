import {Create, Identifier, RaRecord, SimpleForm, TextInput} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'
import {MemberDiscount} from '../types'

const MemberDiscountCreate = () => {
    return (
        <Create
            title="Создать льготника"
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as MemberDiscount

                return `/${member_rate.name}/${record.rate_id}/show`
            }}
        >
            <SimpleForm>
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
