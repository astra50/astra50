import defaults from './defaults'
import ContractorCreate from './ContractorCreate'
import ContractorEdit from './ContractorEdit'
import ContractorList from './ContractorList'
import ContractorShow from './ContractorShow'

const contractor = {
    name: defaults.reference,
    list: ContractorList,
    create: ContractorCreate,
    edit: ContractorEdit,
    show: ContractorShow,
    options: {
        label: defaults.label,
    }
}

export default contractor
