import {FieldProps, useRecordContext} from 'react-admin'
import {Person} from '../types'

export interface PersonFieldProps extends FieldProps<Person> {
    withPhone?: boolean,
}

export const PersonField = ({withPhone = false}: PersonFieldProps) => {
    const record = useRecordContext<Person>()

    if (!record) {
        return null
    }

    return <span>{personFormat(record, withPhone)}</span>
}

export function personFormat(record: Person, withPhone?: boolean) {
    let result = `${record.lastname ?? ''} ${record.firstname ?? ''} ${record.middlename ?? ''}`.trim()

    if (!result) {
        result = record.phone
    } else if (withPhone && record.phone) {
        result += ` (${record.phone})`
    }

    return result
}
