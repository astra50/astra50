import ArchiveIcon from '@mui/icons-material/Archive'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RestoreIcon from '@mui/icons-material/Restore'
import {Box, Container, CssBaseline, Grid, Typography} from '@mui/material'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import React, {useState} from 'react'
import {LayoutProps, Loading, useAuthState} from 'react-admin'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props: LayoutProps) => {
    const [value, setValue] = useState(0)
    const { isLoading, authenticated } = useAuthState();

    if (isLoading) return <Loading/>

    return <Container style={{backgroundColor: '#fff'}}>
        <CssBaseline/>
        {props.children}
        <Divider/>
        <Footer/>
        {authenticated && <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_event, newValue) => {
                    setValue(newValue)
                }}
            >
                <BottomNavigationAction label="Recents" icon={<RestoreIcon/>}/>
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon/>}/>
                <BottomNavigationAction label="Archive" icon={<ArchiveIcon/>}/>
            </BottomNavigation>
        </Paper>}
    </Container>
}

const Footer = () => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            СНТ Астра © {`${new Date().getFullYear()}`}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
