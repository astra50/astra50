import {Identifier, RaRecord} from 'react-admin'

interface Record extends RaRecord, Timestampable {
}

export interface Timestampable {
    updated_at: string,
    created_at: string,
}

interface HasBalance {
    balance: number,
    balance_at: string,
}

export interface Street extends Record {
    name: string,
}

export interface Land extends Record {
    street_id: Identifier,
    name: string,
}

export interface Person extends Record, HasBalance {
    lastname: string,
    firstname: string,
    middlename: string,
    phone: string,
    phone_second: string,
    email: string,
}

export interface MemberRate extends Record {
    amount: number,
    since: string,
    until: string,
}

export interface MemberDiscount extends Record {
    rate_id: Identifier,
    account_id: Identifier,
    comment: string,
}

export interface Target extends Record, Timestampable {
    name: string,
}

export interface Gate extends Record {
    name: string,
    phone?: string,
}

export interface Account extends Record, HasBalance {
    number: string,
    comment?: string,
    owner_id: string,
    end_at: string,
}

export interface AccountLand extends Record, HasBalance {
    account_id: string,
    land_id: string,
}

export interface AccountPerson extends Record, HasBalance {
    account_id: string,
    person_id: string,
}

export interface Contractor extends Record {
    name: string,
    comment: string,
}
