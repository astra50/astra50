import defaults from './defaults'
import GateCreate from './GateCreate'
import GateEdit from './GateEdit'
import GateList from './GateList'
import GateShow from './GateShow'

const gate = {
    name: defaults.reference,
    list: GateList,
    create: GateCreate,
    show: GateShow,
    edit: GateEdit,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'name',
}

export default gate
