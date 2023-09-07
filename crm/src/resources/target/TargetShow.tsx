import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Divider} from '@mui/material'
import {
    BooleanField,
    Button,
    DateField,
    EditButton,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin'
import {Link} from 'react-router-dom'
import {CommentField} from '../../components/comment'
import {MoneyField} from '../../components/money'
import target_payment from '../target_payment'
import {Target} from '../../types'

const Actions = () => {
    const record = useRecordContext<Target>()

    if (!record) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <Button
                label="Платежи"
                component={Link}
                to={{
                    pathname: `/${target_payment.name}`,
                    search: `filter=${JSON.stringify({target_id: record!.id})}`,
                }}
                startIcon={<FontAwesomeIcon icon={faRubleSign}/>}
            />
            <EditButton record={record}/>
        </TopToolbar>
    )
}

const TargetShow = () => {
    return (
        <Show
            actions={<Actions/>}
        >
            <SimpleShowLayout>
                <TextField source="id"/>

                <TextField source="name" label="Цель"/>
                <BooleanField source="is_public" label="Опубликовано"/>
                <CommentField/>
                <MoneyField source="initial_amount" label="Начальная сумма"/>
                <MoneyField source="total_amount" label="Целевая сумма"/>
                <MoneyField source="payer_amount" label="Сумма с человека"/>
                <MoneyField source="current_amount" label="Баланс"/>
                <MoneyField source="increment_amount" label="Всего поступлений"/>
                <MoneyField source="decrement_amount" label="Всего списаний"/>

                <Divider/>
                <DateField source="created_at" label="Создан" showTime={true}/>
                <DateField source="updated_at" label="Обновлён" showTime={true}/>
            </SimpleShowLayout>
        </Show>
    )
}

export default TargetShow
