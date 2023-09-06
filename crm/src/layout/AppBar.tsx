import {Box, Typography} from '@mui/material'
import {AppBar} from 'react-admin'
import UserMenu from './UserMenu'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default () => (
    <AppBar
        userMenu={<UserMenu/>}
    >
        <Box flex="1">
            <Typography variant="h6" id="react-admin-title"></Typography>
        </Box>
    </AppBar>
)
