import defaults from './defaults'
import GateOpenList from './GateOpenList'
import GateOpenShow from './GateOpenShow'

const gate_open = {
    name: defaults.reference,
    list: GateOpenList,
    show: GateOpenShow,
    options: {
        label: defaults.label,
    },
}

export default gate_open
