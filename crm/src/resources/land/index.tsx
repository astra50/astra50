import defaults from './defaults'
import LandCreate from './LandCreate'
import LandEdit from './LandEdit'
import LandList from './LandList'
import LandShow from './LandShow'

const land = {
    name: defaults.reference,
    list: LandList,
    create: LandCreate,
    edit: LandEdit,
    show: LandShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'number',
}

export default land
