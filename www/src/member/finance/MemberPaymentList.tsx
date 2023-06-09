import {useMediaQuery} from '@mui/material'
import {Datagrid, DateField, List, Loading, NumberField, ReferenceField, TextField} from 'react-admin'
import {useMyAccountsQuery} from './__gql-generated/MyAccountsQuery.generated'

const MemberPaymentList = () => {
    const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'))
    const {data, loading} = useMyAccountsQuery()

    if (loading) return <Loading/>

    const accounts = data!.account!.length

    return (<>
            <List
                actions={false}
                empty={false}
                sort={{field: 'paid_at', order: 'DESC'}}
                perPage={25}
                exporter={false}
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
            </List>
        </>
    )
}

export default MemberPaymentList
