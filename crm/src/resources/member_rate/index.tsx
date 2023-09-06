import MemberRateCreate from './MemberRateCreate'
import MemberRateEdit from './MemberRateEdit'
import MemberRateList from './MemberRateList'
import MemberRateShow from './MemberRateShow'

const member_rate = {
    name: 'member_rate',
    list: MemberRateList,
    create: MemberRateCreate,
    edit: MemberRateEdit,
    show: MemberRateShow,
}

export default member_rate
