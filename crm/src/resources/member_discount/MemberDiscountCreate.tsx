import {Create, Identifier, RaRecord, required, SimpleForm} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {MemberDiscount} from '../../types'
import {AccountReferenceInput} from '../account/AccountReference'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'

const MemberDiscountCreate = () => {
    return (
        <Create
            redirect={(_resource?: string, _id?: Identifier, data?: Partial<RaRecord>) => {
                const record = data as MemberDiscount

                return `${member_rate.name}/${record.rate_id}/show`
            }}
        >
            <SimpleForm>
                <MemberRateReferenceInput label="Ставка" fullWidth validate={required()}/>
                <AccountReferenceInput validate={required()}/>
                <CommentInput/>
            </SimpleForm>
        </Create>
    )
}

export default MemberDiscountCreate
