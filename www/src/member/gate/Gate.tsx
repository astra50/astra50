import {faVideoSlash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NavigationIcon from '@mui/icons-material/Navigation'
import {Box, Card, Stack, Tab, Tabs, useMediaQuery} from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import Fab from '@mui/material/Fab'
import dayjs, {Dayjs} from 'dayjs'
import {ReactNode, SyntheticEvent, useEffect, useState} from 'react'
import {LinearProgress} from 'react-admin'
import ReactPlayer from 'react-player'
import {useGateOpenSubscription} from './__gql-generated/GateOpenSubscription.generated'
import {GateWithLastOpenFragment, useGatesQuery} from './__gql-generated/GatesQuery.generated'
import {useOpenGateMutation} from './__gql-generated/OpenGateMutation.generated'

export const Gate = () => (
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        flexGrow={2}
    >
        <GateList/>
    </Box>
)

interface TabPanelProps {
    children?: ReactNode,
    index: number,
    value: number,
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...rest} = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...rest}
        >
            {value === index && (
                <Box
                    sx={{
                        p: 2,
                        marginTop: 2,
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {children}
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const GateList = () => {
    const [value, setValue] = useState(0)
    const {data: gates} = useGatesQuery()
    const {data: gateOpen} = useGateOpenSubscription()
    const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'))

    const gateFromEvent = gateOpen?.gate_open[0]?.gate
    if (gateFromEvent) {
        // TODO https://github.com/apollographql/apollo-client/issues/7557
        gateFromEvent.opens[0].created_at = dayjs(gateFromEvent.opens[0].created_at)
    }
    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Stack
            justifyContent="space-between"
            alignItems="center"
            height="100%"
            flexGrow={2}
        >
            <Card>
                {gates?.gate.map((item, i) => {
                    const gate = gateFromEvent?.id === item.id ? gateFromEvent : item

                    return (
                        <CardMedia
                            sx={{height: 'auto !important', width: '80vw', aspectRatio: '16/9'}}
                            style={{
                                display: value === i ? 'flex' : 'none',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            key={i}
                        >
                            {gate.cctv ? <ReactPlayer
                                light
                                controls
                                playing={value === i}
                                width="100%"
                                height="100%"
                                url={gate.cctv!.url!}
                            /> : <FontAwesomeIcon icon={faVideoSlash} size={isSmall ? '6x' : '10x'}/>}
                        </CardMedia>
                    )
                })}
            </Card>
            <Box>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        {gates?.gate.map((item, i) => {
                            const gate = gateFromEvent?.id === item.id ? gateFromEvent : item

                            return <Tab label={`${gate.number} ${gate.name}`} {...a11yProps(i)} key={gate.id}/>
                        })}
                    </Tabs>
                </Box>
                {gates?.gate.map((item, i) => {
                    const gate = gateFromEvent?.id === item.id ? gateFromEvent : item

                    return (
                        <TabPanel value={value} index={i} key={gate.id}>
                            <GateButtonWithCountdown gate={gate}/>
                        </TabPanel>
                    )
                })}
            </Box>
        </Stack>
    )
}

interface GateButtonWithCountdownProps {
    gate: GateWithLastOpenFragment,
}

const GateButtonWithCountdown = (props: GateButtonWithCountdownProps) => {
    const {gate} = props
    const allowClickAfter = gate.opens[0]?.created_at.add(gate.delay, 'second') ?? dayjs()
    const isAllowInFuture = allowClickAfter.isAfter(dayjs(), 'second')

    const [disabled, setDisabled] = useState(false)

    if (!disabled && isAllowInFuture) {
        const timeout = allowClickAfter.diff(dayjs(), 'second') * 1000

        if (timeout > 0) {
            setDisabled(true)

            setTimeout(() => setDisabled(false), timeout)
        }
    }

    const onClick = () => {
        setDisabled(true)

        setTimeout(() => setDisabled(false), gate.delay * 1000)
    }

    return <Stack>
        <GateButton
            key={gate.id}
            gate={gate}
            disabled={disabled || isAllowInFuture}
            disable={onClick}
        />
        {isAllowInFuture
            ? <Countdown delay={gate.delay} allowClickAfter={allowClickAfter}/>
            : <div style={{width: '160px', height: '20px'}}/>
        }
    </Stack>
}

interface GateButtonProps {
    gate: GateWithLastOpenFragment,
    disabled: boolean,

    disable(): void,
}

const GateButton = (props: GateButtonProps) => {
    const {gate, disable} = props

    const [openGateMutation] = useOpenGateMutation({
        variables: {
            id: gate.id,
        },
    })

    const handleClick = async () => {
        disable()

        await openGateMutation()
    }

    return <Fab
        color="primary"
        variant="extended"
        onClick={handleClick}
        disabled={props.disabled}
        style={{zIndex: 'auto'}}
    >
        <NavigationIcon sx={{mr: 1}}/>
        Открыть &nbsp;
    </Fab>
}

interface CountdownProps {
    delay: number,
    allowClickAfter: Dayjs,
}

const Countdown = (props: CountdownProps) => {
    const {delay, allowClickAfter} = props
    const [progress, setProgress] = useState(0)

    const advanceProgress = () => {
        const diff = allowClickAfter.diff(dayjs(), 'second')
        if (diff <= 0) {
            return 100
        }

        return Math.min(100 - diff / delay * 100, 100)
    }

    advanceProgress()

    useEffect(() => {
        const timer = setInterval(() => setProgress(advanceProgress()), 500)

        return () => clearInterval(timer)
    }, [])

    return <Box sx={{width: '100%'}}>
        <LinearProgress variant="determinate" value={progress} timeout={0}/>
    </Box>
}
