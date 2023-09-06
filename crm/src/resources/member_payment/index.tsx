import MemberPaymentCreate from './MemberPaymentCreate'
import MemberPaymentEdit from './MemberPaymentEdit'
import MemberPaymentList from './MemberPaymentList'
import MemberPaymentShow from './MemberPaymentShow'

const member_payment = {
    name: 'member_payment',
    list: MemberPaymentList,
    create: MemberPaymentCreate,
    edit: MemberPaymentEdit,
    show: MemberPaymentShow,
}

export default member_payment
