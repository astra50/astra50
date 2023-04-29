import {Layout, LayoutProps} from 'react-admin'
import AppBar from './AppBar'
import Menu from './Menu'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props: LayoutProps) => (
    <Layout {...props}
            appBar={AppBar}
            menu={Menu}
    />
)
