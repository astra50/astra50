import AccountCreate from './AccountCreate'
import AccountEdit from './AccountEdit'
import AccountList from './AccountList'
import AccountShow from './AccountShow'
import defaults from './defaults'

const account = {
    name: defaults.reference,
    list: AccountList,
    create: AccountCreate,
    edit: AccountEdit,
    show: AccountShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'number',
}

export default account
