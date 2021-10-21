import {Identifier, Record} from 'react-admin';

export interface Street extends Record {
    name: string,
}

export interface Land extends Record {
    street_id: Identifier,
    name: string,
}

export interface Person extends Record {
    lastname: string,
    firstname: string,
    middlename: string,
    phone: string,
}

export interface MemberRate extends Record {
    rate: number,
    since: string,
    until: string,
}

export interface Target extends Record {
    name: string,
}
