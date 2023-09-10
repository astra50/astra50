import AccountPersonCreate from './AccountPersonCreate'
import AccountPersonEdit from './AccountPersonEdit'
import defaults from './defaults'

const account_person = {
    name: defaults.reference,
    create: AccountPersonCreate,
    edit: AccountPersonEdit,
    options: {
        label: defaults.label,
    },
    recordRepresentation: '',
}

export default account_person
