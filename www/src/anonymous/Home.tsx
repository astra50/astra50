import ym from '@appigram/react-yandex-metrika'
import {faArrowRightFromBracket, faKey, faLocationDot, faQrcode} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Card, CardActions, CardHeader, Stack} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import QRCode from 'qrcode'
import React, {useEffect, useState} from 'react'
import {Loading, useAuthState, useLogin, useLogout} from 'react-admin'
import {useLandsQuery} from './__gql-generated/queries.generated'

// TODO fetch from API
const info = [
    ['Телефон', {value: '+7 (999) 333-67-31', link: 'tel:+79993336731'}],
    ['E-Mail', {value: 'info@astra50.ru', link: 'mailto:info@astra50.ru'}],
]

// TODO fetch from API
const requisites = [
    ['Полное наименования', 'Садовое Некоммерческое Товарищество "АСТРА"'],
    ['Сокращенное наименования', 'СНТ "АСТРА"'],
    ['Дата создания', '24.12.2002'],
    ['ОГРН', '1025007516820'],
    ['ИНН', '5074022777'],
    ['КПП', '507401001'],
    ['Юр. Адрес', '142143, Московская область, г. Подольск, д. Борисовка'],
    ['ОКВЭД', '68.32.2 (01.13.3, 01.25, 01.29)'],
    ['ПФР', '060056010053'],
    ['ФСС', '501811009550181'],
    ['ОКПО', '13322354'],
    ['ОКАТО', '46460000051'],
    ['ОКТМО', '46760000146'],
    ['ОКОГУ', '4210014'],
    ['ОКФС', '16'],
    ['ОКОПФ', '20702'],
]

// TODO fetch from API
const bank = [
    ['Наименование', 'СНТ "АСТРА"'],
    ['Р/C', '40703810438000016950'],
    ['БИК', '044525225'],
    ['Банк', 'ПАО СБЕРБАНК'],
    ['К/C', '30101810400000000225'],
    ['ИНН', '5074022777'],
    ['КПП', '507401001'],
]

// TODO fetch from API
const organizations = [
    ['Мосэнергосбыт (подключение)', {value: '8 (499) 550-95-50', link: 'tel:8499550-95-50'}, 'mosenergosbyt.ru'],
    ['Россети Москва (диспетчер)', {value: '8 (800) 220-0-220', link: 'tel:88002200220'}, 'rossetimr.ru'],
    ['ООО «ЛайнНэт» (интернет)', {value: '8 (495) 858-11-10', link: 'tel:84958581110'}, 'line-net.ru'],
    ['МСК-НТ (Вывоз мусора)', {value: '8 800 234-36-70', link: 'tel:88002343670'}, 'mskobl.msk-nt.ru'],
]

export const Home = () => (
    <Stack
        spacing={4}
        justifyContent="center"
        alignContent="center"
    >
        <Box sx={{margin: 'auto'}}>
            <Card>
                <CardHeader title="Контакты"/>
                <InformationTable rows={info}/>
                <CardActions style={{width: '100%', justifyContent: 'space-between'}}>
                    <NavButton/>
                    <LoginButton/>
                </CardActions>
            </Card>
            <Card sx={{marginTop: 3}}>
                <CardHeader title="Реквизиты"/>
                <InformationTable rows={requisites}/>
            </Card>
            <Card sx={{marginTop: 3}}>
                <CardHeader title="Банковские реквизиты"/>
                <InformationTable rows={bank}/>
                <CardActions>
                    <QrButton/>
                </CardActions>
            </Card>
            <Card sx={{marginTop: 3}}>
                <CardHeader title="Контакты организаций"/>
                <InformationTable rows={organizations}/>
            </Card>
        </Box>
    </Stack>
)

type Cell = { value: string, link: string } | string

type Row = Cell[]

interface InformationTableProps {
    rows: Row[]
}

const InformationTable = (props: InformationTableProps) => {
    const {rows} = props

    return (
        <TableContainer component={Paper}>
            <Table sx={{width: '100%', margin: 'auto'}} aria-label="simple table" size="small">
                <TableBody>
                    {rows.map((row, i) =>
                        <TableRow
                            key={i}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            {row.map((cell, j) => {
                                const [value, link] = typeof cell === 'string'
                                    ? [cell, null]
                                    : [cell.value, cell.link]

                                return j === 0
                                    ? <TableCell key={j} component="th" scope="row">{value}</TableCell>
                                    : <TableCell key={j} align="center">
                                        {link ? (<a href={link}>{value}</a>) : <>{value}</>}
                                    </TableCell>
                            })}
                        </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const NavButton = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        ym('hit', 'dashboard-nav-button')
        setOpen(true)
    }
    const handleClose = () => setOpen(false)

    const {data} = useLandsQuery()

    const style = {
        position: 'absolute' as 'absolute',
        margin: 'auto',
        top: '10px',
        // left: '40%',
        // width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'block',
    }

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
                startIcon={<FontAwesomeIcon icon={faLocationDot}/>}
                size="small"
            >Навигация</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll'}}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Навигация
                    </Typography>
                    <Card id="modal-modal-description">
                        <CardHeader title="Ворота"/>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    {data?.gate.map((gate) => (
                                        <TableRow
                                            key={gate.id}
                                        >
                                            <TableCell component="th" scope="row">{gate.name}</TableCell>
                                            <TableCell>{gate.number}</TableCell>
                                            <TableCell><NavLink coordinates={gate.coordinates}/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <CardHeader title="Участки"/>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    {data?.land.map((land) => (
                                        <TableRow
                                            key={land.id}
                                        >
                                            <TableCell component="th" scope="row">{land.street.name}</TableCell>
                                            <TableCell>{land.number}</TableCell>
                                            <TableCell><NavLink coordinates={land.coordinates}/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            </Modal>
        </div>
    )
}

interface NavLinkProps {
    coordinates: string,
}

const NavLink = (props: NavLinkProps) => {
    const {coordinates} = props

    let coords = encodeURIComponent(coordinates.replace('(', '').replace(')', '').split(',').reverse().join(','))

    return <a
        href={`https://yandex.ru/maps/213/moscow/?ll=${coords}&whatshere[point]=${coords}&z=18`}
        target="_blank"
        rel="noreferrer"
    >
        <FontAwesomeIcon icon={faLocationDot}/>
    </a>
}

// TODO fetch from API
const QrBankData = 'ST00012|Name=СНТ "АСТРА"|PersonalAcc=40703810438000016950|BankName=ПАО СБЕРБАНК|BIC=044525225|CorrespAcc=30101810400000000225|Purpose=Оплата членских взносов уч |PayeeINN=5074022777|KPP=507401001'

const QrButton = () => {
    const [open, setOpen] = useState(false)
    const [qrcode, setQrcode] = useState<string>()

    const handleOpen = () => {
        ym('hit', 'dashboard-qrcode-button')
        setOpen(true)
    }
    const handleClose = () => setOpen(false)

    const style = {
        position: 'absolute' as 'absolute',
        // margin: 'auto',
        top: '10px',
        // left: '40%',
        // bgcolor: 'background.paper',
        // boxShadow: 24,
        p: 4,
        // display: 'block',
    }

    useEffect(() => {
        (async () => {
            setQrcode(await QRCode.toDataURL(QrBankData))
        })()
    }, [])

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
                startIcon={<FontAwesomeIcon icon={faQrcode}/>}
                size="small"
            >QR Code</Button>
            {qrcode && <Modal
                open={open}
                onClose={handleClose}
                aria-describedby="modal-qr-description"
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll'}}
            >
                <Box sx={style}>
                    <img alt="qrcode" src={qrcode}/>
                </Box>
            </Modal>}
        </div>
    )
}

const LoginButton = () => {
    const {isLoading, authenticated} = useAuthState()
    const login = useLogin()
    const logout = useLogout()

    if (isLoading) return <Loading/>

    return authenticated ? <Button
            onClick={logout}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faArrowRightFromBracket}/>}
            size="small"
        >
            Выход
        </Button>
        : <Button
            onClick={login}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faKey}/>}
            size="small"
        >
            Вход
        </Button>
}
