import defaults from './defaults'
import PersonPhoneCreate from './PersonPhoneCreate'
import PersonPhoneEdit from './PersonPhoneEdit'
import PersonPhoneList from './PersonPhoneList'
import PersonPhoneShow from './PersonPhoneShow'

const person_phone = {
    name: defaults.reference,
    list: PersonPhoneList,
    create: PersonPhoneCreate,
    edit: PersonPhoneEdit,
    show: PersonPhoneShow,
    options: {
        label: defaults.label,
    }
}

export default person_phone
