import CctvCreate from './CctvCreate'
import CctvEdit from './CctvEdit'
import CctvList from './CctvList'
import CctvShow from './CctvShow'
import defaults from './defaults'

const cctv = {
    name: defaults.reference,
    list: CctvList,
    create: CctvCreate,
    show: CctvShow,
    edit: CctvEdit,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'name',
}

export default cctv
