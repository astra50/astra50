import React, {useEffect, useState} from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import {Admin, Resource} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import Dashboard from './Dashboard';
import {StreetCreate, StreetEdit, StreetList} from './streets';
import {LandCreate, LandEdit, LandList} from "./lands";
import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import Keycloak from "keycloak-js";
import useAuthProvider from "./authProvider";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {setContext} from "@apollo/client/link/context";

let keycloakConfig = {
    url: 'https://auth.astra50.ru/auth',
    realm: 'astra50',
    clientId: 'crm-oauth',
    onLoad: "login-required",
};

const keycloak = Keycloak(keycloakConfig);

const onTokenExpired = () => {
    keycloak
        .updateToken(30)
        .catch(() => {
            console.error("failed to refresh token");
        });
};

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

const AdminWithKeycloak = () => {
    const keycloakAuthProvider = useAuthProvider();

    const [dataProvider, setDataProvider] = useState(null);

    const httpLink = createHttpLink({
        uri: 'https://crm.astra50.ru/v1/graphql',
    });

    const authLink = setContext((_, {headers}) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${keycloak.token}`,
                'X-Hasura-Role': 'government',
            }
        }
    });

    const clientWithAuth = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    useEffect(() => {
        const buildDataProvider = async () => {
            const dataProvider = await buildHasuraProvider({
                client: clientWithAuth
            });
            setDataProvider(() => dataProvider);
        };
        buildDataProvider();
    }, []);

    if (!dataProvider) return <p>Загрузка...</p>;

    return (
        <Admin
            dashboard={Dashboard}
            title="СНТ Астра - CRM"
            dataProvider={dataProvider}
            authProvider={keycloakAuthProvider}
            i18nProvider={i18nProvider}
        >
            <Resource
                name="street"
                list={StreetList}
                edit={StreetEdit}
                create={StreetCreate}
            />
            <Resource
                name="land"
                list={LandList}
                edit={LandEdit}
                create={LandCreate}
            />
        </Admin>
    );
};

const App = () => {
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            LoadingComponent={<div></div>}
            initOptions={keycloakConfig}
            onTokenExpired={onTokenExpired}
        >
            <React.Fragment>
                <AdminWithKeycloak/>
            </React.Fragment>
        </ReactKeycloakProvider>
    );
};

export default App;
