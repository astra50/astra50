import defaults from './defaults'
import PersonEmailCreate from './PersonEmailCreate'
import PersonEmailEdit from './PersonEmailEdit'
import PersonEmailList from './PersonEmailList'
import PersonEmailShow from './PersonEmailShow'

const person_email = {
    name: defaults.reference,
    list: PersonEmailList,
    create: PersonEmailCreate,
    edit: PersonEmailEdit,
    show: PersonEmailShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'email',
}

export default person_email
