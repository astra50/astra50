import account from './account'
import account_land from './account_land'
import account_person from './account_person'
import audit from './audit'
import cctv from './cctv'
import contact from './contact'
import contractor from './contractor'
import gate from './gate'
import gate_open from './gate_open'
import gate_open_reason from './gate_open_reason'
import land from './land'
import member_discount from './member_discount'
import member_payment from './member_payment'
import member_rate from './member_rate'
import person from './person'
import person_email from './person_email'
import person_phone from './person_phone'
import refinance_rate from './refinance_rate'
import street from './street'
import target from './target'
import target_payment from './target_payment'
import user from './user'

export const resources = [
    ...audit,
    account_land,
    account_person,
    account,
    cctv,
    contact,
    contractor,
    gate_open_reason,
    gate_open,
    gate,
    land,
    member_discount,
    member_payment,
    member_rate,
    person_email,
    person_phone,
    person,
    refinance_rate,
    street,
    target_payment,
    target,
    user,
]
