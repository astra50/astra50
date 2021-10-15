import React, {useEffect, useState} from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import {Admin, Resource} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import Dashboard from './pages/Dashboard';
import {StreetCreate, StreetEdit, StreetList} from './pages/streets';
import {LandCreate, LandEdit, LandList} from "./pages/lands";
import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import Keycloak from "keycloak-js";
import useAuthProvider from "./authProvider";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {setContext} from "@apollo/client/link/context";
import Layout from './Layout';
import {PersonCreate, PersonEdit, PersonList} from "./pages/person";
import {LandOwnershipCreate, LandOwnershipEdit, LandOwnershipList} from "./pages/landOwnership";
import {MemberRateCreate, MemberRateEdit, MemberRateList} from "./pages/memberRate";
import {MemberPaymentCreate, MemberPaymentEdit, MemberPaymentList} from "./pages/memberPayment";
import {TargetCreate, TargetEdit, TargetList} from "./pages/targets";
import {TargetPaymentCreate, TargetPaymentEdit, TargetPaymentList} from "./pages/targetPayments";

let keycloakConfig = {
    url: 'https://auth.astra50.ru/auth',
    realm: 'astra50',
    clientId: 'hasura-oauth',
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


    useEffect(() => {
        const httpLink = createHttpLink({
            uri: window.location.protocol
                + '//api.'
                + window.location.hostname.split('.').splice(-2).join('.')
                + '/v1/graphql',
        });

        const authLink = setContext((_, {headers}) => {
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${keycloak.token}`,
                    'X-Hasura-Role': 'government',
                },
            }
        });

        const clientWithAuth = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        });

        const buildDataProvider = async () => {
            const dataProvider = await buildHasuraProvider({
                client: clientWithAuth,
            });
            setDataProvider(() => dataProvider);
        };
        buildDataProvider();
    }, []);

    if (!dataProvider) return <p>Загрузка...</p>;

    return (
        <Admin
            disableTelemetry
            dashboard={Dashboard}
            title="СНТ Астра - CRM"
            dataProvider={dataProvider}
            authProvider={keycloakAuthProvider}
            i18nProvider={i18nProvider}
            layout={Layout}
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
            <Resource
                name="person"
                list={PersonList}
                edit={PersonEdit}
                create={PersonCreate}
            />
            <Resource
                name="land_owner"
            />
            <Resource
                name="land_ownership"
                list={LandOwnershipList}
                edit={LandOwnershipEdit}
                create={LandOwnershipCreate}
            />
            <Resource
                name="member_rate"
                list={MemberRateList}
                edit={MemberRateEdit}
                create={MemberRateCreate}
            />
            <Resource
                name="member_payment"
                list={MemberPaymentList}
                edit={MemberPaymentEdit}
                create={MemberPaymentCreate}
            />
            <Resource
                name="target"
                list={TargetList}
                edit={TargetEdit}
                create={TargetCreate}
            />
            <Resource
                name="target_payment"
                list={TargetPaymentList}
                edit={TargetPaymentEdit}
                create={TargetPaymentCreate}
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
