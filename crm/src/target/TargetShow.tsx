import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'
import {BooleanField, EditButton, Show, SimpleShowLayout, TextField, TopToolbar, useRecordContext} from 'react-admin'
import {Link} from 'react-router-dom'
import {MoneyField} from '../money'
import target_payment from '../target_payment'
import {Target} from '../types'
import {TargetField} from './TargetField'

const Actions = () => {
    const record = useRecordContext<Target>()

    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                color="primary"
                component={Link}
                to={{
                    pathname: `/${target_payment.name}`,
                    search: `filter=${JSON.stringify({target_id: record!.id})}`,
                }}
            >
                <FontAwesomeIcon icon={faRubleSign}/> Платежи
            </Button>
            <EditButton record={record}/>
        </TopToolbar>
    )
}

const TargetShow = () => {
    return (
        <Show
            title={<TargetField/>}
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="name" label="Цель"/>
                <BooleanField source="is_public" label="Опубликовано"/>
                <TextField source="comment" label="Комментарий"/>
                <MoneyField source="initial_amount" label="Начальная сумма"/>
                <MoneyField source="total_amount" label="Целевая сумма"/>
                <MoneyField source="payer_amount" label="Сумма с человека"/>
                <MoneyField source="current_amount" label="Баланс"/>
                <MoneyField source="increment_amount" label="Всего поступлений"/>
                <MoneyField source="decrement_amount" label="Всего списаний"/>
            </SimpleShowLayout>
        </Show>
    )
}

export default TargetShow
