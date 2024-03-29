import {CreateButton, FilterButton, List, SelectColumnsButton, TextInput, TopToolbar} from 'react-admin'
import {GateReferenceInput} from '../gate/GateReference'
import {GateOpenReasonReferenceInput} from '../gate_open_reason/GateOpenReasonReference'
import {PersonReferenceInput} from '../person/PersonReference'
import {GateOpenListDatagrid} from './GateOpenListDatagrid'

const filters = [
    <TextInput source="source" label="Поиск" alwaysOn/>,
    <GateReferenceInput source="gate_id"/>,
    <GateOpenReasonReferenceInput source="reason_id" alwaysOn/>,
    <PersonReferenceInput source="person_id" alwaysOn/>,
]

const GateOpenActions = () => (
    <TopToolbar>
        <SelectColumnsButton/>
        <FilterButton/>
        <CreateButton/>
    </TopToolbar>
)

const GateOpenList = () => {
    return (
        <List
            actions={<GateOpenActions/>}
            empty={false}
            sort={{field: 'created_at', order: 'DESC'}}
            filters={filters}
            perPage={25}
        >
            <GateOpenListDatagrid/>
        </List>
    )
}

export default GateOpenList
