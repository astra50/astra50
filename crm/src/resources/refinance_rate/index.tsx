import defaults from './defaults'
import RefinanceRateCreate from './RefinanceRateCreate'
import RefinanceRateEdit from './RefinanceRateEdit'
import RefinanceRateList from './RefinanceRateList'
import RefinanceRateShow from './RefinanceRateShow'

const refinance_rate = {
    name: defaults.reference,
    list: RefinanceRateList,
    create: RefinanceRateCreate,
    edit: RefinanceRateEdit,
    show: RefinanceRateShow,
    options: {
        label: defaults.label,
    }
}

export default refinance_rate
