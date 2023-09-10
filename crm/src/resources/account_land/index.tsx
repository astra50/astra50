import AccountLandCreate from './AccountLandCreate'
import AccountLandEdit from './AccountLandEdit'
import defaults from './defaults'

const account_land = {
    name: defaults.reference,
    create: AccountLandCreate,
    edit: AccountLandEdit,
    options: {
        label: defaults.label,
    },
    recordRepresentation: '',
}

export default account_land
