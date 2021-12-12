import {FieldProps} from 'react-admin'
import {Target} from '../types'

export interface TargetFieldProps extends FieldProps<Target> {
    withPhone?: boolean,
}

export const TargetField = ({record, withPhone = false}: TargetFieldProps) => {
    if (!record) {
        return null
    }

    return <span>{targetFormat(record, withPhone)}</span>
}

export function targetFormat(record: Target, withPhone?: boolean) {
    let result = `${record.lastname ?? ''} ${record.firstname ?? ''} ${record.middlename ?? ''}`.trim()

    if (!result) {
        result = record.phone
    } else if (withPhone && record.phone) {
        result += ` (${record.phone})`
    }

    return result
}
