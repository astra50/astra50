import AuditActionList from './AuditActionList'
import AuditActionShow from './AuditActionShow'

const audit_action = {
    name: 'audit_action',
    list: AuditActionList,
    show: AuditActionShow,
    options: {
        label: 'Аудит',
    },
    recordRepresentation: '',
}

export default audit_action
