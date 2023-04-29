import {FieldProps, useRecordContext} from 'react-admin'
import {Person} from '../types'

export interface PersonFieldProps extends FieldProps<Person> {
    withPhone?: boolean,
}

export const PersonField = () => {
    const record = useRecordContext<Person>()

    if (!record) {
        return null
    }

    return <span>`${record.lastname} ${record.firstname} ${record.middlename}`.trim()</span>
}
