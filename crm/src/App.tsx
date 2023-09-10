import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {YMInitializer} from '@appigram/react-yandex-metrika'
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import en from 'ra-language-english'
// @ts-ignore
import ru from 'ra-language-russian'
import React, {useEffect, useState} from 'react'
import {
    Admin,
    CustomRoutes,
    DataProvider,
    I18nContextProvider,
    Loading,
    resolveBrowserLocale,
    Resource,
    TranslationMessages,
} from 'react-admin'
import {Route} from 'react-router-dom'
import useAuthProvider from './authProvider'
import {Dashboard} from './dashboard/Dashboard'
import {Layout} from './layout'
import {resources} from './resources'
import Settings from './settings/Settings'

const translations: { [index: string]: TranslationMessages } = {
    en,
    ru: ((ru: TranslationMessages) => {
        ru.ra.page.show = en.ra.page.show
        ru.ra.page.edit = en.ra.page.edit

        return ru
    })(ru),
}

const i18Provider = polyglotI18nProvider(
    locale => translations[locale],
    resolveBrowserLocale('ru'),
    [
        {locale: 'ru', name: 'Русский'},
        {locale: 'en', name: 'English'},
    ],
)

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
                darkTheme={{palette: {mode: 'dark'}}}
            >
                {resources.map((res) => <Resource key={res.name} {...res}/>)}
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
                    <YMInitializer
                        accounts={[94451023]}
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
