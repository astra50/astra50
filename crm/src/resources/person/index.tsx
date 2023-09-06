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
}

export default person
