import {gql, useMutation} from '@apollo/client'
import {Button, Datagrid, List, ListProps, TextField} from 'react-admin'

const OPEN_GATE = gql`
        mutation MyMutation($gateId: String!) {
            open_gate_site(args: {gate: $gateId}) {
                id
            }
        }
    `

const OpenGateButton = (props: any) => {
    const [openGate, {data, loading, error}] = useMutation(OPEN_GATE)
    if (loading) console.log('Loading')
    if (error) console.log(error)
    if (data) console.log(data)

    return <Button onClick={(e) => {
        e.stopPropagation()

        openGate({variables: {gateId: props.record.id}})
    }} title="Open Gate" label="Open gate"/>
}

const GateList = (props: ListProps) => {
    return (
        <List
            title="Ворота"
            sort={{field: 'name', order: 'ASC'}}
            {...props}
        >
            <Datagrid rowClick="edit">
                <TextField
                    source="name"
                    label="Название"
                />
                <TextField
                    source="phone"
                    label="Телефон"
                />
                <OpenGateButton/>
            </Datagrid>
        </List>
    )
}

export default GateList
