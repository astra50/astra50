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
import {
    AdminContext,
    AdminUI,
    Authenticated,
    CustomRoutes,
    DataProvider,
    I18nContextProvider,
    Loading,
    Resource,
    useAuthState,
    useRedirect,
} from 'react-admin'
import {Route, useLocation} from 'react-router-dom'
import {Home} from './anonymous/Home'
import {scalarTypePolicies as scalarTypePoliciesAnonymous} from './anonymous/types'
import useAuthProvider from './auth/authProvider'
import {Layout} from './layout'
import {MemberPaymentList} from './member/finance'
import {Gate} from './member/gate'
import {scalarTypePolicies as scalarTypePoliciesMember} from './member/types'
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
                for (let role of ['member', 'villager']) {
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
                cache: new InMemoryCache({
                    typePolicies: {
                        ...scalarTypePoliciesAnonymous,
                        ...scalarTypePoliciesMember,
                    },
                }),
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
            <AdminContext
                authProvider={authProvider}
                dataProvider={dataProvider}
                i18nProvider={i18Provider}
            >
                <Resources/>
            </AdminContext>
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

const Resources = () => {
    const location = useLocation()
    const redirect = useRedirect()
    const authState = useAuthState()

    useEffect(() => {
        if (authState.authenticated && location.pathname === '/') {
            // Gate is default page for authenticated user
            redirect('/gate')
        }
    }, [])

    return (
        <AdminUI
            title="СНТ Астра"
            disableTelemetry
            layout={Layout}
            loginPage={false}
        >
            <Resource name="account"/>
            <Resource name="member_payment" list={MemberPaymentList}/>
            <Resource name="person"/>
            <CustomRoutes>
                <Route path="/" element={<Home/>}/>
                <Route path="/gate" element={<Authenticated requireAuth><Gate/></Authenticated>}/>
                <Route path="/settings" element={<Authenticated requireAuth><Settings/></Authenticated>}/>
            </CustomRoutes>
        </AdminUI>
    )
}

export default App
