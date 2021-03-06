import {createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import russianMessages from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {Admin, DataProvider, Loading, Resource, TranslationProvider} from 'react-admin'
import account from './account'
import account_land from './account_land'
import account_person from './account_person'
import useAuthProvider from './authProvider'
import {Dashboard} from './dashboard/Dashboard'
import gate from './gate'
import gate_open from './gate_open'
import gate_open_reason from './gate_open_reason'
import land from './land'
import Layout from './Layout'
import member_payment from './member_payment'
import member_rate from './member_rate'
import person from './person'
import street from './street'
import target from './target'
import target_payment from './target_payment'

const i18Provider = polyglotI18nProvider(() => russianMessages, 'ru')

const AdminWithKeycloak = () => {
    const [dataProvider, setDataProvider] = useState<DataProvider | null>(null)
    const authProvider = useAuthProvider()
    const keycloak = useKeycloak().keycloak

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: '/v1/graphql',
        })

        const authLink = setContext((_, {headers}) => {
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${keycloak.token}`,
                    'X-Hasura-Role': 'government',
                },
            }
        })

        const buildDataProvider = async () => {
            const dataProvider = await buildHasuraProvider({
                clientOptions: {
                    link: authLink.concat(httpLink),
                    cache: new InMemoryCache(),
                },
            })
            setDataProvider(() => dataProvider)
        }
        buildDataProvider()
    }, [keycloak])

    if (!dataProvider) return <Loading/>

    return (
        <Admin
            disableTelemetry
            dashboard={Dashboard}
            title="?????? ?????????? - CRM"
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18Provider}
            layout={Layout}
        >
            <Resource {...account}/>
            <Resource {...account_land}/>
            <Resource {...account_person}/>
            <Resource {...gate_open_reason}/>
            <Resource {...gate_open}/>
            <Resource {...gate}/>
            <Resource {...land}/>
            <Resource {...member_payment}/>
            <Resource {...member_rate}/>
            <Resource {...person}/>
            <Resource {...street}/>
            <Resource {...target_payment}/>
            <Resource {...target}/>
        </Admin>
    )
}

const App = () => {
    const keycloak = new Keycloak()

    keycloak.onAuthRefreshError = () => setTimeout(keycloak.updateToken, 0, [-1])

    return (
        <TranslationProvider i18nProvider={i18Provider}>
            <ReactKeycloakProvider
                authClient={keycloak}
                LoadingComponent={<div/>}
                initOptions={{
                    onLoad: 'login-required',
                }}
            >
                <React.Fragment>
                    <AdminWithKeycloak/>
                </React.Fragment>
            </ReactKeycloakProvider>
        </TranslationProvider>

    )
}

export default App
