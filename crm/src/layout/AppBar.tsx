import {Box, createTheme, Typography} from '@mui/material'
import {AppBar, defaultTheme, ToggleThemeButton} from 'react-admin'
import UserMenu from './UserMenu'

const darkTheme = createTheme({
    palette: {mode: 'dark'},
})

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default () => (
    <AppBar
        userMenu={<UserMenu/>}
    >
        <Box flex="1">
            <Typography variant="h6" id="react-admin-title"></Typography>
        </Box>
        <ToggleThemeButton
            lightTheme={defaultTheme}
            darkTheme={darkTheme}
        />
    </AppBar>
)
