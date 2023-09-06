import {Person} from '../../types'
import PersonCreate from './PersonCreate'
import PersonEdit from './PersonEdit'
import PersonList from './PersonList'
import PersonShow from './PersonShow'

const person = {
    name: 'person',
    list: PersonList,
    create: PersonCreate,
    edit: PersonEdit,
    show: PersonShow,
    label: 'Человек',
    recordRepresentation: (record: Person) => `${record.lastname} ${record.firstname} ${record.middlename}`
}

export default person
