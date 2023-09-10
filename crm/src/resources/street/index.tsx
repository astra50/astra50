import defaults from './defaults'
import StreetCreate from './StreetCreate'
import StreetEdit from './StreetEdit'
import StreetList from './StreetList'
import StreetShow from './StreetShow'

const street = {
    name: defaults.reference,
    list: StreetList,
    create: StreetCreate,
    edit: StreetEdit,
    show: StreetShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'name',
}

export default street
