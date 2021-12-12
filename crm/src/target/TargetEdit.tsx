import {Edit, EditProps, FieldProps, SimpleForm, TextInput} from 'react-admin'
import {MoneyInput} from '../money'
import {Target} from '../types'


const Title = (props: FieldProps<Target>) => {
    const {record} = props

    return <span>Цель {record ? `"${record.name}"` : ''}</span>
}

const TargetEdit = (props: EditProps) => {
    return (
        <Edit {...props}
              title={<Title/>}>
            <SimpleForm>
                <TextInput source="name" label="Цель"/>
                <TextInput source="comment" label="Комментарий"/>
                <MoneyInput source="initial_amount" label="Начальная сумма"/>
                <MoneyInput source="total_amount" label="Целевая сумма"/>
                <MoneyInput source="payer_amount" label="Сумма с человека"/>
            </SimpleForm>
        </Edit>
    )
}

export default TargetEdit
