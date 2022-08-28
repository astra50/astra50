import {FieldProps} from 'react-admin'
import {MemberRate} from '../types'

export interface MemberRateFieldProps extends FieldProps<MemberRate> {
    withPhone?: boolean,
}

export const MemberRateField = ({record}: MemberRateFieldProps) => {
    if (!record) {
        return null
    }

    return <span>{`${record.amount} от ${record.since}`}</span>
}
