import defaults from './defaults'
import MemberRateCreate from './MemberRateCreate'
import MemberRateEdit from './MemberRateEdit'
import MemberRateList from './MemberRateList'
import MemberRateShow from './MemberRateShow'

const member_rate = {
    name: defaults.reference,
    list: MemberRateList,
    create: MemberRateCreate,
    edit: MemberRateEdit,
    show: MemberRateShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'amount',
}

export default member_rate
