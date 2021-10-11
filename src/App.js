import React, {useEffect, useState} from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import {Admin, Resource} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import {StreetCreate, StreetEdit, StreetList} from './streets';
import {LandCreate, LandEdit, LandList} from "./lands";

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

const App = () => {
    const [dataProvider, setDataProvider] = useState(null);

    useEffect(() => {
        const buildDataProvider = async () => {
            const dataProvider = await buildHasuraProvider({
                clientOptions: {uri: 'http://crm.astra50.local/v1/graphql'}
            });
            setDataProvider(() => dataProvider);
        };
        buildDataProvider();
    }, []);

    if (!dataProvider) return <p>Загрузка...</p>;

    return (
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
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

export default App;
