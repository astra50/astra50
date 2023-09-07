import defaults from './defaults'
import AccountPersonCreate from './AccountPersonCreate'
import AccountPersonEdit from './AccountPersonEdit'

const account_person = {
    name: defaults.reference,
    create: AccountPersonCreate,
    edit: AccountPersonEdit,
    options: {
        label: defaults.label,
    }
}

export default account_person
