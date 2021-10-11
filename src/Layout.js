import {AppBar, DashboardMenuItem, Layout, Menu, MenuItemLink, UserMenu} from 'react-admin';
import {forwardRef} from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHouseUser, faRoad, faRubleSign, faUserFriends} from "@fortawesome/free-solid-svg-icons";

const ConfigurationMenu = forwardRef(({onClick}, ref) => (
    <MenuItemLink
        ref={ref}
        to="/configuration"
        primaryText="Configuration"
        leftIcon={<SettingsIcon/>}
        onClick={onClick} // close the menu on click
    />
));

const MyUserMenu = props => (
    <UserMenu {...props}>
        <ConfigurationMenu/>
    </UserMenu>
);

const MyAppBar = props => <AppBar
    {...props}
    userMenu={<MyUserMenu/>}
/>;

const MyMenu = (props) => (
    <Menu {...props}>
        <DashboardMenuItem/>
        <MenuItemLink to="/street" primaryText="Улицы" leftIcon={<FontAwesomeIcon icon={faRoad}/>}/>
        <MenuItemLink to="/land" primaryText="Участки" leftIcon={<FontAwesomeIcon icon={faHouseUser}/>}/>
        <MenuItemLink to="/person" primaryText="Садоводы" leftIcon={<FontAwesomeIcon icon={faUserFriends}/>}/>
        <MenuItemLink to="/payment" primaryText="Платежи" leftIcon={<FontAwesomeIcon icon={faRubleSign}/>}/>
    </Menu>
);

const MyLayout = props => <Layout
    {...props}
    appBar={MyAppBar}
    menu={MyMenu}
/>;

export default MyLayout;
