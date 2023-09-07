import defaults from './defaults'
import TargetPaymentCreate from './TargetPaymentCreate'
import TargetPaymentEdit from './TargetPaymentEdit'
import TargetPaymentList from './TargetPaymentList'
import targetPaymentShow from './TargetPaymentShow'

const target_payment = {
    name: defaults.reference,
    list: TargetPaymentList,
    create: TargetPaymentCreate,
    show: targetPaymentShow,
    edit: TargetPaymentEdit,
    options: {
        label: defaults.label,
    }
}

export default target_payment
