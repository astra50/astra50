import ym from '@appigram/react-yandex-metrika'
import {faLocationDot, faQrcode} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Card, CardActions, CardHeader, Container, Stack} from '@mui/material'
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
import {useEffect, useState} from 'react'
import {useLandsQuery} from './__gql-generated/queries.generated'

// TODO fetch from API
const info = [
    {key: 'Телефон', value: '+7 (999) 333-67-31', link: 'tel:+79993336731'},
    {key: 'E-Mail', value: 'info@astra50.ru', link: 'mailto:info@astra50.ru'},
    {key: 'Адрес', value: '142143, МО, ПОДОЛЬСК ГОРОД, БОРИСОВКА ДЕРЕВНЯ'},
    {key: 'ОГРН', value: '1025007516820'},
    {key: 'ИНН', value: '5074022777'},
    {key: 'КПП', value: '507401001'},
]

// TODO fetch from API
const bank = [
    {key: 'Наименование', value: 'СНТ "АСТРА"'},
    {key: 'Р/C', value: '40703810438000016950'},
    {key: 'БИК', value: '044525225'},
    {key: 'Банк', value: 'ПАО СБЕРБАНК'},
    {key: 'К/C', value: '30101810400000000225'},
    {key: 'ИНН', value: '5074022777'},
    {key: 'КПП', value: '507401001'},
]

export const Dashboard = () => (
    <Stack
        spacing={4}
        justifyContent="center"
        alignContent="center"
    >
        <Container maxWidth="sm">
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
        <Card>
            <CardHeader title="Информация"/>
            <InformationTable rows={info}/>
            <CardActions>
                <NavButton/>
            </CardActions>
        </Card>
        <Card>
            <CardHeader title="Банковские реквизиты"/>
            <InformationTable rows={bank}/>
            <CardActions>
                <QrButton/>
            </CardActions>
        </Card>
    </Stack>
)

interface Row {
    key: string,
    value: string,
    link?: string,
}

interface InformationTableProps {
    rows: Row[]
}

const InformationTable = (props: InformationTableProps) => {
    const {rows} = props

    return (
        <TableContainer component={Paper}>
            <Table sx={{width: '100%', margin: 'auto'}} aria-label="simple table" size="small">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.key}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">{row.key}</TableCell>
                            <TableCell align="center">
                                {row.link ? (<a href={row.link}>{row.value}</a>) : <>{row.value}</>}
                            </TableCell>
                        </TableRow>
                    ))}
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
