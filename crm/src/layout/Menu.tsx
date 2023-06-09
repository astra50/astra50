import {
    faBank,
    faBullseye,
    faGhost,
    faHome,
    faJournalWhills,
    faPercentage,
    faRoad,
    faRubleSign,
    faToriiGate,
    faUserFriends, faUsers,
    faWallet,
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Divider} from '@mui/material'
import {Menu} from 'react-admin'

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default () => (
    <Menu>
        <Menu.DashboardItem/>
        <Divider/>
        <Menu.Item to="/street" primaryText="Улицы" leftIcon={<FontAwesomeIcon icon={faRoad}/>}/>
        <Menu.Item to="/land" primaryText="Участки" leftIcon={<FontAwesomeIcon icon={faHome}/>}/>
        <Menu.Item to="/person" primaryText="Садоводы" leftIcon={<FontAwesomeIcon icon={faUserFriends}/>}/>
        <Menu.Item to="/account" primaryText="Лицевые счета" leftIcon={<FontAwesomeIcon icon={faWallet}/>}/>
        <Menu.Item to="/contractor" primaryText="Контрагенты"
                   leftIcon={<FontAwesomeIcon icon={faGhost}/>}/>
        <Divider/>
        <Menu.Item to="/member_rate" primaryText="Ставки" leftIcon={<FontAwesomeIcon icon={faPercentage}/>}/>
        <Menu.Item to="/member_payment" primaryText="Членские Взносы"
                   leftIcon={<FontAwesomeIcon icon={faRubleSign}/>}/>
        <Menu.Item to="/target" primaryText="Цели" leftIcon={<FontAwesomeIcon icon={faBullseye}/>}/>
        <Menu.Item to="/target_payment" primaryText="Целевые Взносы"
                   leftIcon={<FontAwesomeIcon icon={faRubleSign}/>}/>
        <Divider/>
        <Menu.Item to="/gate" primaryText="Ворота"
                   leftIcon={<FontAwesomeIcon icon={faToriiGate}/>}/>
        <Menu.Item to="/gate_open" primaryText="Журнал ворот"
                   leftIcon={<FontAwesomeIcon icon={faJournalWhills}/>}/>
        <Divider/>
        <Menu.Item to="/refinance_rate" primaryText="Ставка Реф."
                   leftIcon={<FontAwesomeIcon icon={faBank}/>}/>
        <Divider/>
        <Menu.Item to="/user" primaryText="Пользователи"
                   leftIcon={<FontAwesomeIcon icon={faUsers}/>}/>
    </Menu>
)
