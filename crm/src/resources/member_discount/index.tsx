import defaults from './defaults'
import MemberDiscountCreate from './MemberDiscountCreate'
import MemberDiscountEdit from './MemberDiscountEdit'
import MemberDiscountShow from './MemberDiscountShow'

const member_discount = {
    name: defaults.reference,
    create: MemberDiscountCreate,
    edit: MemberDiscountEdit,
    show: MemberDiscountShow,
    options: {
        label: defaults.label,
    }
}

export default member_discount
