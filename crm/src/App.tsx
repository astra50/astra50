import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import russianMessages from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {Admin, Loading, Resource, TranslationProvider} from 'react-admin'
import useAuthProvider from './authProvider'
import {Dashboard} from './dashboard/Dashboard'
import gate from './gate'
import gate_open from './gate_open'
import gate_open_reason from './gate_open_reason'
import land from './land'
import land_ownership from './land_ownership'
import Layout from './Layout'
import member_payment from './member_payment'
import member_rate from './member_rate'
import person from './person'
import street from './street'
import target from './target'
import target_payment from './target_payment'

const AdminWithKeycloak = () => {
    const [dataProvider, setDataProvider] = useState(null)
    const authProvider = useAuthProvider()
    const keycloak = useKeycloak().keycloak

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: window.location.protocol
                + '//api.'
                + window.location.hostname.split('.').splice(-2).join('.')
                + '/v1/graphql',
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

        const clientWithAuth = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        })

        const buildDataProvider = async () => {
            const dataProvider = await buildHasuraProvider({
                client: clientWithAuth,
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
            title="СНТ Астра - CRM"
            dataProvider={dataProvider}
            authProvider={authProvider}
            layout={Layout}
        >
            <Resource {...street}/>
            <Resource {...land}/>
            <Resource {...person}/>
            <Resource name="land_owner"/>
            <Resource {...land_ownership}/>
            <Resource {...member_rate}/>
            <Resource {...member_payment}/>
            <Resource {...target}/>
            <Resource {...target_payment}/>
            <Resource {...gate}/>
            <Resource {...gate_open_reason}/>
            <Resource {...gate_open}/>
        </Admin>
    )
}

const App = () => {
    const keycloak = Keycloak({
        url: 'https://auth.astra50.ru/auth',
        realm: 'astra50',
        clientId: 'hasura-oauth',
    })

    keycloak.onAuthRefreshError = () => setTimeout(keycloak.updateToken, 0, [-1])

    return (
        <TranslationProvider i18nProvider={polyglotI18nProvider(() => russianMessages, 'ru')}>
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
