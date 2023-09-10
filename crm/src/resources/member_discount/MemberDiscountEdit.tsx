import {Edit, required, SimpleForm, useNotify, useRedirect} from 'react-admin'
import {CommentInput} from '../../components/comment'
import {MemberDiscount} from '../../types'
import {AccountReferenceInput} from '../account/AccountReference'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'

const MemberDiscountEdit = () => {
    let notify = useNotify()
    const redirect = useRedirect()

    const onSuccess = (data: MemberDiscount) => {
        notify('ra.notification.updated', {
            type: 'success',
            messageArgs: {
                smart_count: 1,
            },
        })
        redirect(`/${member_rate.name}/${data.rate_id}/show`)
    }

    return (
        <Edit
            mutationOptions={{onSuccess}}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <MemberRateReferenceInput label="Ставка" fullWidth validate={required()}/>
                <AccountReferenceInput validate={required()}/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default MemberDiscountEdit
