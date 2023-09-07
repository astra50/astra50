import React from 'react'
import {FunctionField, RaRecord} from 'react-admin'

export interface JsonFieldProps {
    label?: string,
    source: string,
    maxWidth?: string,
}

export const JsonField = (props: JsonFieldProps) => {
    return (
        <FunctionField label={props.label ?? props.source} render={(record: RaRecord) => {

            return <pre
                style={{maxWidth: props.maxWidth ?? '950px', overflowY: 'scroll'}}>
                        {JSON.stringify(record[props.source], null, 2)}
                    </pre>
        }}/>
    )
}
