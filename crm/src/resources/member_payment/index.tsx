import defaults from './defaults'
import MemberPaymentCreate from './MemberPaymentCreate'
import MemberPaymentEdit from './MemberPaymentEdit'
import MemberPaymentList from './MemberPaymentList'
import MemberPaymentShow from './MemberPaymentShow'

const member_payment = {
    name: defaults.reference,
    list: MemberPaymentList,
    create: MemberPaymentCreate,
    edit: MemberPaymentEdit,
    show: MemberPaymentShow,
    options: {
        label: defaults.label,
    }
}

export default member_payment
