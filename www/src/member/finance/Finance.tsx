import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {Alert, AlertTitle, Box, useMediaQuery} from '@mui/material'
import Tab from '@mui/material/Tab'
import dayjs from 'dayjs'
import React, {useState} from 'react'
import {
    Datagrid,
    DateField,
    InfiniteList,
    InfinitePagination,
    Loading,
    NumberField,
    ReferenceField,
    ResourceContextProvider,
    TextField,
} from 'react-admin'
import {useAccountsQuery} from './__gql-generated/Accounts.generated'
import {useSummaryQuery} from './__gql-generated/Summary.generated'

const Finance = () => {
    const [value, setValue] = useState('1')
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return (
        <Box>
            <TabContext
                value={value}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TabList onChange={handleChange}>
                        <Tab label="Сводка" value="1"/>
                        <Tab label="Детализация" value="2"/>
                    </TabList>
                </Box>
                <TabPanel value="1" style={{paddingLeft: 0, paddingRight: 0}}>
                    <Summary/>
                </TabPanel>
                <TabPanel value="2" style={{padding: 0}}>
                    <ResourceContextProvider value="member_payment">
                        <MemberPaymentList/>
                    </ResourceContextProvider>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

const Summary = () => {
    const {data, loading} = useSummaryQuery()

    if (loading) return <Loading/>

    const me = data!.me[0]

    if (!me || !me.balance) {
        return (
            <Alert severity="error">
                <AlertTitle>Данные <strong>не найдены</strong></AlertTitle>
            </Alert>
        )
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            {me.balance >= 0
                ? <Alert severity="success">
                    <AlertTitle>Задолженность <strong>отсутствует</strong></AlertTitle>
                </Alert>
                : <Alert severity="warning">
                    <AlertTitle>Ваша задолженность <strong>{me.balance * -1} рублей</strong></AlertTitle>
                    Последний платёж был <strong>{dayjs(me.last_paid_at!).format('LL')}</strong> на
                    сумму <strong>{me.last_paid_amount} рублей</strong>
                </Alert>}
        </Box>
    )
}

const MemberPaymentList = () => {
    const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'))
    const {data, loading} = useAccountsQuery()

    if (loading) return <Loading/>

    const accounts = data!.account!.length

    return (
        <InfiniteList
            actions={false}
            empty={false}
            sort={{field: 'paid_at', order: 'DESC'}}
            perPage={25}
            exporter={false}
            pagination={<InfinitePagination sx={{padding: '0'}}/>}
        >
            <Datagrid
                rowClick={false}
                bulkActionButtons={false}
            >
                {(accounts > 1 && !isSmall) && <ReferenceField
                    source="account_id"
                    reference="account"
                    label="Лицевой счёт"
                >
                    <TextField source="number"/>
                </ReferenceField>}
                {!isSmall && <ReferenceField
                    source="person_id"
                    reference="person"
                    label="Плательщик"
                >
                    <TextField source="full_name"/>
                </ReferenceField>}
                <NumberField
                    source="amount"
                    label="Сумма"
                    options={{style: 'currency', currency: 'RUB'}}
                />
                {!isSmall && <NumberField source="rate" label="Ставка"/>}
                <NumberField
                    source="balance"
                    label="Баланс"
                    options={{style: 'currency', currency: 'RUB'}}
                />
                <DateField source="paid_at" label="Дата"/>
            </Datagrid>
        </InfiniteList>
    )
}

export default Finance
