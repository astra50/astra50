import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client'
import {YMInitializer} from '@appigram/react-yandex-metrika'
import {ReactKeycloakProvider} from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import russianMessages from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {Admin, CustomRoutes, DataProvider, I18nContextProvider, Loading} from 'react-admin'
import {Route} from 'react-router-dom'
import useAuthProvider from './authProvider'
import {Dashboard} from './dashboard/Dashboard'
import {Layout} from './layout'
import Settings from './settings/Settings'

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

    useEffect(() => {
        const httpLink = createHttpLink({
            uri: '/v1/graphql',
        })

        const clientWithAuth = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache(),
        });

        (async () => {
            const dataProvider = await buildHasuraProvider({
                client: clientWithAuth,
            })
            setApollo(clientWithAuth)
            setDataProvider(() => dataProvider)
        })()
    }, [])

    if (!dataProvider || !apollo) return <Loading/>

    return (
        <ApolloProvider client={apollo}>
            <Admin
                disableTelemetry
                authProvider={authProvider}
                dashboard={Dashboard}
                title="СНТ Астра"
                dataProvider={dataProvider}
                i18nProvider={i18Provider}
                layout={Layout}
            >
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
                   onLoad: 'check-sso',
               }}
            >
                <React.Fragment>
                    <YMInitializer
                        accounts={[39294260]}
                        options={{
                            webvisor: true,
                            clickmap: true,
                            trackLinks: true,
                            accurateTrackBounce: true,
                        }}
                        version="2"
                    />
                    <AdminWithKeycloak/>
                </React.Fragment>
            </ReactKeycloakProvider>
        </I18nContextProvider>

    )
}

export default App
