import ContactCreate from './ContactCreate'
import ContactEdit from './ContactEdit'
import ContactList from './ContactList'
import ContactShow from './ContactShow'
import defaults from './defaults'

const contact = {
    name: defaults.reference,
    list: ContactList,
    create: ContactCreate,
    edit: ContactEdit,
    show: ContactShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'name',
}

export default contact
