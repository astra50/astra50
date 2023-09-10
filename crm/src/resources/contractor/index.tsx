import ContractorCreate from './ContractorCreate'
import ContractorEdit from './ContractorEdit'
import ContractorList from './ContractorList'
import ContractorShow from './ContractorShow'
import defaults from './defaults'

const contractor = {
    name: defaults.reference,
    list: ContractorList,
    create: ContractorCreate,
    edit: ContractorEdit,
    show: ContractorShow,
    options: {
        label: defaults.label,
    },
    recordRepresentation: 'id',
}

export default contractor
