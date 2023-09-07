import defaults from './defaults'
import AccountCreate from './AccountCreate'
import AccountEdit from './AccountEdit'
import AccountList from './AccountList'
import AccountShow from './AccountShow'

const account = {
    name: defaults.reference,
    list: AccountList,
    create: AccountCreate,
    edit: AccountEdit,
    show: AccountShow,
    options: {
        label: defaults.label,
    }
}

export default account
