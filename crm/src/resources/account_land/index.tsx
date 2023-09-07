import defaults from './defaults'
import AccountLandCreate from './AccountLandCreate'
import AccountLandEdit from './AccountLandEdit'

const account_land = {
    name: defaults.reference,
    create: AccountLandCreate,
    edit: AccountLandEdit,
    options: {
        label: defaults.label,
    }
}

export default account_land
