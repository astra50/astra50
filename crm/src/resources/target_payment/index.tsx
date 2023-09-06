import TargetPaymentCreate from './TargetPaymentCreate'
import TargetPaymentEdit from './TargetPaymentEdit'
import TargetPaymentList from './TargetPaymentList'
import targetPaymentShow from './TargetPaymentShow'

const target_payment = {
    name: 'target_payment',
    list: TargetPaymentList,
    create: TargetPaymentCreate,
    show: targetPaymentShow,
    edit: TargetPaymentEdit,
}

export default target_payment
