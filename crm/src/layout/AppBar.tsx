import {AppBar} from 'react-admin'
import UserMenu from './UserMenu'

export default () => (
    <AppBar
        userMenu={<UserMenu/>}
    >
    </AppBar>
)
