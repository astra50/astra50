import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {getMainDefinition} from '@apollo/client/utilities'
import {YMInitializer} from '@appigram/react-yandex-metrika'
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import {createClient} from 'graphql-ws'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
// @ts-ignore
import russianMessages from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {Admin, Authenticated, CustomRoutes, DataProvider, I18nContextProvider, Loading} from 'react-admin'
import {Route} from 'react-router-dom'
import {Home} from './anonymous/Home'
import useAuthProvider from './auth/authProvider'
import {Layout} from './layout'
import {Finance} from './member/finance'
import {Gate} from './member/gate'
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
    const keycloak = useKeycloak().keycloak

    const authProvider = useAuthProvider()

    useEffect(() => {
        (async () => {
            const roles = await authProvider.getPermissions(null)

            const role = roles.length === 0 ? 'anonymous' : ((roles: string[]) => {
                for (let role of ['government', 'member', 'villager']) {
                    if (roles.includes(role)) {
                        return role
                    }
                }

                return 'user'
            })(roles)

            const httpLink = createHttpLink({
                uri: '/v1/graphql',
            })

            const authHeaders = {
                ...(keycloak.token && {authorization: `Bearer ${keycloak.token}`}),
                'X-Hasura-Role': role,
            }

            const authLink = setContext((_, {headers}) => {
                return {
                    headers: {
                        ...headers,
                        ...authHeaders,
                    },
                }
            })

            const wsLink = new GraphQLWsLink(createClient({
                url: `${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${window.location.host}/v1/graphql`,
                connectionParams: {
                    headers: authHeaders,
                },
            }))

            const splitLink = split(
                ({query}) => {
                    const definition = getMainDefinition(query)
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    )
                },
                authLink.concat(wsLink),
                authLink.concat(httpLink),
            )

            const clientWithAuth = new ApolloClient({
                link: splitLink,
                cache: new InMemoryCache(),
            })

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
                authProvider={authProvider}
                dataProvider={dataProvider}
                disableTelemetry
                i18nProvider={i18Provider}
                layout={Layout}
                loginPage={false}
                title="СНТ Астра"
            >
                <CustomRoutes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/finance" element={<Authenticated requireAuth><Finance/></Authenticated>}/>
                    <Route path="/gate" element={<Authenticated requireAuth><Gate/></Authenticated>}/>
                    <Route path="/settings" element={<Authenticated requireAuth><Settings/></Authenticated>}/>
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
                LoadingComponent={<Loading/>}
                initOptions={{
                    onLoad: 'check-sso',
                    enableLogging: false,
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
