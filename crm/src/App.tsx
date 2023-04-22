import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import russianMessages from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {Admin, CustomRoutes, DataProvider, I18nContextProvider, Loading, Resource} from 'react-admin'
import {Route} from 'react-router-dom'
import account from './account'
import account_land from './account_land'
import account_person from './account_person'
import useAuthProvider from './authProvider'
import contractor from './contractor'
import {Dashboard} from './dashboard/Dashboard'
import gate from './gate'
import gate_open from './gate_open'
import gate_open_reason from './gate_open_reason'
import land from './land'
import {Layout} from './layout'
import member_discount from './member_discount'
import member_payment from './member_payment'
import member_rate from './member_rate'
import person from './person'
import refinance_rate from './refinance_rate'
import Settings from './settings/Settings'
import street from './street'
import target from './target'
import target_payment from './target_payment'

const i18Provider = polyglotI18nProvider(() => {
    let messages = russianMessages

    messages.ra.configurable ||= { // TODO Bypass empty translations, can be remove after ra-language-russian released
        customize: 'Customize',
        configureMode: 'Configure this page',
        inspector: {
            title: 'Inspector',
            content: 'Hover the application UI elements to configure them',
            reset: 'Reset Settings',
        },
        SimpleList: {
            primaryText: 'Primary text',
            secondaryText: 'Secondary text',
            tertiaryText: 'Tertiary text',
        },
    }

    return messages
}, 'ru')

const AdminWithKeycloak = () => {
    const [dataProvider, setDataProvider] = useState<DataProvider | null>(null)
    const [apollo, setApollo] = useState<ApolloClient<any> | null>(null)
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

        const clientWithAuth = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        });

        (async () => {
            const dataProvider = await buildHasuraProvider({
                client: clientWithAuth,
            })
            setApollo(clientWithAuth)
            setDataProvider(() => dataProvider)
        })()
    }, [keycloak])

    if (!dataProvider || !apollo) return <Loading/>

    return (
        <ApolloProvider client={apollo}>
            <Admin
                disableTelemetry
                dashboard={Dashboard}
                title="СНТ Астра - CRM"
                dataProvider={dataProvider}
                authProvider={authProvider}
                i18nProvider={i18Provider}
                layout={Layout}
            >
                <Resource {...account_land}/>
                <Resource {...account_person}/>
                <Resource {...account}/>
                <Resource {...contractor}/>
                <Resource {...gate_open_reason}/>
                <Resource {...gate_open}/>
                <Resource {...gate}/>
                <Resource {...land}/>
                <Resource {...member_discount}/>
                <Resource {...member_payment}/>
                <Resource {...member_rate}/>
                <Resource {...person}/>
                <Resource {...refinance_rate}/>
                <Resource {...street}/>
                <Resource {...target_payment}/>
                <Resource {...target}/>
                <CustomRoutes>
                    <Route path="/settings" element={<Settings/>}/>
                </CustomRoutes>
            </Admin>
        </ApolloProvider>
    )
}

const App = () => {
    const keycloak = new Keycloak()

    keycloak.onAuthRefreshError = () => setTimeout(keycloak.updateToken, 0, [-1])

    return (
        <I18nContextProvider value={i18Provider}>
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
        </I18nContextProvider>

    )
}

export default App
