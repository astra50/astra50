import UserMenu from './UserMenu'
import { defaultTheme, AppBar, ToggleThemeButton } from 'react-admin';
import { createTheme, Box, Typography } from '@mui/material';

const darkTheme = createTheme({
    palette: { mode: 'dark' },
});

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
