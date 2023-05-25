import CurrencyRuble from '@mui/icons-material/CurrencyRuble'
import DoorSliding from '@mui/icons-material/DoorSliding'
import Home from '@mui/icons-material/Home'
import {Box, Container, CssBaseline, Grid, Typography} from '@mui/material'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import React, {useState} from 'react'
import {LayoutProps, Loading, useAuthState, useRedirect} from 'react-admin'
import {useLocation} from 'react-router-dom'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props: LayoutProps) => {
    const {pathname} = useLocation()
    const [value, setValue] = useState<string>(pathname)
    const redirect = useRedirect()
    const {isLoading, authenticated} = useAuthState([], false)
    if (isLoading) return <Loading/>

    return <Container style={{backgroundColor: '#fff'}}>
        <Container maxWidth="sm" sx={{marginBottom: 2}}>
            <img
                alt="logo"
                src="/files/logo.png"
                loading="lazy"
                style={{
                    marginTop: '30px',
                    width: '100%',
                    maxHeight: 200,
                }}/>
        </Container>
        <CssBaseline/>
        {props.children}
        <Divider sx={{marginTop: 2}}/>
        <Footer/>
        <div style={{marginBottom: authenticated ? 56 : 0}}/>
        {authenticated && <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_event, newValue) => {
                    setValue(newValue)
                    redirect(newValue)
                }}
            >
                <BottomNavigationAction label="Главная" value="/" icon={<Home/>}/>
                <BottomNavigationAction label="Ворота" value="/gate" icon={<DoorSliding/>}/>
                <BottomNavigationAction label="Финансы" value="/finance" icon={<CurrencyRuble/>}/>
            </BottomNavigation>
        </Paper>}
    </Container>
}

const Footer = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: 'auto',
                paddingTop: '1rem',
                paddingBottom: '1rem',
            }}
        >
            <Grid container direction="column">
                <Grid item xs={12}>
                    <Typography variant="subtitle1">
                        СНТ Астра © {`${new Date().getFullYear()}`} <a href="#/gate">gate</a>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}