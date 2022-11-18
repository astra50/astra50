import {faRubleSign} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    BooleanField,
    EditButton,
    EditProps,
    ListButton,
    Show,
    ShowActionsProps,
    SimpleShowLayout,
    TextField,
    TopToolbar,
} from 'react-admin'
import {MoneyField} from '../money'
import {TargetField} from './TargetField'

const Actions = ({basePath, data}: ShowActionsProps) => {
    if (!data) {
        return <TopToolbar/>
    }

    return (
        <TopToolbar>
            <ListButton
                basePath={'/member_payment?' + new URLSearchParams({filter: JSON.stringify({target_id: data!.id})})}
                label="Членские взносы"
                icon={<FontAwesomeIcon icon={faRubleSign}/>}
            />
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>
    )
}

const TargetShow = (props: EditProps) => {
    return (
        <Show {...props}
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
                <MoneyField source="current_amount" label="Собрано"/>
            </SimpleShowLayout>
        </Show>
    )
}

export default TargetShow
