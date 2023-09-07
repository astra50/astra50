import defaults from './defaults'
import UserEdit from './UserEdit'
import UserList from './UserList'
import UserShow from './UserShow'

const user = {
    name: defaults.reference,
    list: UserList,
    edit: UserEdit,
    show: UserShow,
    options: {
        label: defaults.label,
    }
}

export default user
