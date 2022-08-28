import {Edit, EditProps, SimpleForm, TextInput, useNotify, useRedirect, useRefresh} from 'react-admin'
import {AccountReferenceInput} from '../account/AccountReference'
import member_rate from '../member_rate'
import {MemberRateReferenceInput} from '../member_rate/MemberRateReference'
import {MemberDiscount} from '../types'

const MemberDiscountEdit = (props: EditProps) => {
    let notify = useNotify()
    const refresh = useRefresh()
    const redirect = useRedirect()

    const onSuccess = ({data}: { data: MemberDiscount }) => {
        notify('ra.notification.updated', 'success', {
            smart_count: 1,
        })
        redirect(`/${member_rate.name}/${data.rate_id}/show`)
        refresh()
    }

    return (
        <Edit {...props} title="Редактировать льготника" onSuccess={onSuccess} mutationMode="pessimistic">
            <SimpleForm>
                <MemberRateReferenceInput label="Ставка" fullWidth/>

                <AccountReferenceInput/>

                <TextInput
                    source="comment"
                    label="Комментарий"
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    )
}

export default MemberDiscountEdit
