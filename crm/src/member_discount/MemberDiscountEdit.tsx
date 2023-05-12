import {Edit, SimpleForm, useNotify, useRedirect, useRefresh} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import {CommentInput} from '../components/comment'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'
import {MemberDiscount} from '../types'

const MemberDiscountEdit = () => {
    let notify = useNotify()
    const refresh = useRefresh()
    const redirect = useRedirect()

    const onSuccess = (data: MemberDiscount) => {
        notify('ra.notification.updated', {
            type: 'success',
            messageArgs: {
                smart_count: 1,
            },
        })
        redirect(`/${member_rate.name}/${data.rate_id}/show`)
        refresh()
    }

    return (
        <Edit
            title="Редактировать льготника"
            mutationOptions={{onSuccess}}
            mutationMode="pessimistic"
        >
            <SimpleForm>
                <MemberRateReferenceInput label="Ставка" fullWidth required/>
                <AccountReferenceInput required/>
                <CommentInput/>
            </SimpleForm>
        </Edit>
    )
}

export default MemberDiscountEdit
