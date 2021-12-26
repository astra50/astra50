import {AppBar, DashboardMenuItem, Layout, Menu, MenuItemLink, UserMenu} from 'react-admin';
import {forwardRef} from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBullseye,
    faHome,
    faJournalWhills,
    faPercentage,
    faRoad,
    faRubleSign,
    faToriiGate,
    faUserFriends,
    faWallet,
} from "@fortawesome/free-solid-svg-icons";

const ConfigurationMenu = forwardRef(({onClick}, ref) => (
    <MenuItemLink
        ref={ref}
        to="/configuration"
        primaryText="Настройки"
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
        <MenuItemLink to="/land" primaryText="Участки" leftIcon={<FontAwesomeIcon icon={faHome}/>}/>
        <MenuItemLink to="/person" primaryText="Садоводы" leftIcon={<FontAwesomeIcon icon={faUserFriends}/>}/>
        <MenuItemLink to="/account" primaryText="Лицевые счета" leftIcon={<FontAwesomeIcon icon={faWallet}/>}/>
        <MenuItemLink to="/member_rate" primaryText="Ставки" leftIcon={<FontAwesomeIcon icon={faPercentage}/>}/>
        <MenuItemLink to="/member_payment" primaryText="Членские Взносы"
                      leftIcon={<FontAwesomeIcon icon={faRubleSign}/>}/>
        <MenuItemLink to="/target" primaryText="Цели" leftIcon={<FontAwesomeIcon icon={faBullseye}/>}/>
        <MenuItemLink to="/target_payment" primaryText="Целевые Взносы"
                      leftIcon={<FontAwesomeIcon icon={faRubleSign}/>}/>
        <MenuItemLink to="/gate" primaryText="Ворота"
                      leftIcon={<FontAwesomeIcon icon={faToriiGate}/>}/>
        <MenuItemLink to="/gate_open" primaryText="Журнал ворот"
                      leftIcon={<FontAwesomeIcon icon={faJournalWhills}/>}/>
    </Menu>
);

const MyLayout = props => <Layout
    {...props}
    appBar={MyAppBar}
    menu={MyMenu}
/>;

export default MyLayout;
