import {ResourceProps} from 'react-admin'
import defaults from './defaults'
import PersonCreate from './PersonCreate'
import PersonEdit from './PersonEdit'
import PersonList from './PersonList'
import PersonShow from './PersonShow'

const person: ResourceProps = {
    name: defaults.reference,
    list: PersonList,
    create: PersonCreate,
    edit: PersonEdit,
    show: PersonShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: (record) => `${record.lastname} ${record.firstname} ${record.middlename}`
}

export default person
