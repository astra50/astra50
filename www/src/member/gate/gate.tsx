import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Box, Tab, Tabs} from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {ReactNode, SyntheticEvent, useEffect, useState} from 'react'
import {useOpenGateMutation} from './__gql-generated/mutations.generated'
import {GateWithLastOpenFragment, useGatesQuery} from './__gql-generated/queries.generated'
import {useGateOpenSubscriptionSubscription} from './__gql-generated/subscriptions.generated'

const gateOpenDelay = 30
console.log(gateOpenDelay)

export const Gate = () => (
    <Box sx={{margin: 'auto'}}>
        <Typography variant="h4" gutterBottom>
            Выберите ворота
        </Typography>
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
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
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
    const {data: gateOpen} = useGateOpenSubscriptionSubscription()

    const gateFromEvent = gateOpen?.gate_open[0]?.gate
    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    console.log(gateOpen)

    return (
        <Box sx={{width: '100%', margin: 'auto'}}
             justifyContent="center"
             alignContent="center"
        >
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
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
                        <GateButton gate={gate} key={gate.id}/>
                    </TabPanel>
                )
            })}
        </Box>
    )
}

interface GateButtonProps {
    gate: GateWithLastOpenFragment,
}

const GateButton = (props: GateButtonProps) => {
    const {gate} = props

    const [delay, _setDelay] = useState(0)
    const [openGateMutation] = useOpenGateMutation({
        variables: {
            id: gate.id,
        },
    })

    useEffect(() => {
        // const lastOpen = gate.opens[0]?.created_at
        // console.log(lastOpen)
        // const allowClickAfter = lastOpen && lastOpen.add(gateOpenDelay, 'second')

        // if (allowClickAfter && allowClickAfter.isAfter(lastOpen)) {
            console.log('Here we go')
            // setTimeout(function () {
            // }, 1000, allowClickAfter)
        // }
    })

    const handleOnClick = async () => {
        const data = await openGateMutation()

        console.log(data)
    }

    return delay > 0
        ? <Button
            variant="text"
            disabled
            startIcon={<FontAwesomeIcon icon={faSpinner} spinPulse/>}
        >
            Открыть
        </Button>
        : <Button
            variant="contained"
            onClick={handleOnClick}
        >
            Открыть
        </Button>
}
