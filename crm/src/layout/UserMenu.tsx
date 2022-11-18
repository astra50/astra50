import {Settings} from '@mui/icons-material'
import {Divider} from '@mui/material'
import {forwardRef} from 'react'
import {Logout, MenuItemLink, UserMenu} from 'react-admin'

const ConfigurationMenu = forwardRef(({onClick}: { onClick?: any }, ref) => (
    <MenuItemLink
        ref={ref}
        to="/settings"
        primaryText="Настройки"
        leftIcon={<Settings/>}
        onClick={onClick} // close the menu on click
    />
))

export default () => (
    <UserMenu>
        <ConfigurationMenu/>
        <Divider/>
        <Logout/>
    </UserMenu>
)
