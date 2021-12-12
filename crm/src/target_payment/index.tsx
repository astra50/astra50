import TargetPaymentCreate from './TargetPaymentCreate'
import TargetPaymentEdit from './TargetPaymentEdit'
import TargetPaymentList from './TargetPaymentList'

const member_payment = {
    name: 'target_payment',
    list: TargetPaymentList,
    create: TargetPaymentCreate,
    edit: TargetPaymentEdit,
}

export default member_payment
