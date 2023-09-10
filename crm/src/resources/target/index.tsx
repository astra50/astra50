import defaults from './defaults'
import TargetCreate from './TargetCreate'
import TargetEdit from './TargetEdit'
import TargetList from './TargetList'
import TargetShow from './TargetShow'

const target = {
    name: defaults.reference,
    list: TargetList,
    create: TargetCreate,
    edit: TargetEdit,
    show: TargetShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'name',
}

export default target
