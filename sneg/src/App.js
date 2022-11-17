import "./App.css";
import {FullscreenControl, Map, YMaps, ZoomControl} from "react-yandex-maps";
import {useEffect, useRef, useState} from "react";

const sneg22 = "eaaf17e5-82e5-4b78-983f-41ecb1086e59" // TODO Вместо костыля можно сделать переключатель

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        "/v1/graphql",
        {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
        },
    );

    return await result.json();
}

const operationsDoc = `
  query targets {
    targets: target {
      id
      name
      payer_amount
      payments {
        land {
          id
          number
          polygon
        }
        amount
      }
    }
  }
`;

function fetchTargets() {
    return fetchGraphQL(
        operationsDoc,
        "targets",
        {},
    );
}

const COLORS = {
    inactive: {background: "#F0F0F0", border: "#a3a3a3"},
    warning: {background: "#F6D55C", border: "#a3a3a3"},
    error: {background: "ED553B", border: "#a3a3a3"},
    success: {background: "3CAEA3", border: "#a3a3a3"},
};

const getAreaColor = (paid, perPayer) => {
    if (paid === 0) return COLORS.error;
    if (paid > 0 && paid < perPayer) return COLORS.warning;
    if (paid >= perPayer) return COLORS.success;
    return COLORS.inactive
};

const mapState = {
    state: {center: [55.486586, 37.609443], zoom: 17.6},
    width: "100%",
    height: "100vh",
    modules: ["meta", "borders", "ObjectManager"],
};

const loadJS = (id, url, location, onLoad) => {
    if (!document.getElementById(id)) {
        const scriptTag = document.createElement("script");
        location.appendChild(scriptTag);
        scriptTag.src = url;
        scriptTag.id = id;
        if (onLoad) {
            scriptTag.onload = onLoad;
        }
    }
};

function App() {
    const mapRef = useRef(null);

    const getLabels = (ymaps) => {
        loadJS(
            "calculateArea",
            "https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js",
            document.head,
        );
        loadJS(
            "polylabel",
            "https://yastatic.net/s3/mapsapi-jslibs/polylabeler/1.0.2/polylabel.min.js",
            document.head,
            () => getLands(ymaps),
        );
    };

    const [target, setTarget] = useState()

    useEffect(async () => {
        const {errors, data} = await fetchTargets();

        if (errors) {
            console.error(errors);

            return
        }

        for (const target of data.targets) {
            if (target.id === sneg22) {
                setTarget(target)

                break
            }
        }
    }, [])

    if (!target) {
        return null
    }

    let totalPayments = 0
    let lands = {}
    for (const payment of target.payments) {
        totalPayments += payment.amount
        const land = payment.land;

        if (typeof lands[land.id] === 'undefined') {
            lands[land.id] = {
                id: land.id,
                number: land.number,
                paid: payment.amount,
                polygon: land.polygon?.replace('((', '').replace('))', '').split('),(').map(i => i.split(',').map(c => parseFloat(c))),
            }
        } else {
            lands[land.id].paid += payment.amount
        }
    }

    const getLands = async (ymap) => {
        await ymap.ready(["polylabel.create"]);
        const objectManager = new ymap.ObjectManager({clusterize: false});
        const areaObjects = [];

        for (const id in lands) {
            const land = lands[id]

            if (land.polygon === undefined) {
                console.error(`Polygon not found for "${land.number}" land.`)

                continue;
            }

            const color = getAreaColor(land.paid, target.payer_amount);

            areaObjects.push({
                type: "Feature",
                id: land.number,
                geometry: {
                    type: "Polygon",
                    coordinates: [land.polygon],
                },
                options: {
                    fillColor: color.background,
                    strokeColor: color.border,
                    opacity: 0.5,
                    strokeWidth: 2,
                    strokeStyle: "solid",
                    labelLayout: `<div class="land-label">${land.paid}</div>`,
                    labelTextSize: {"18_20": 18, "20_21": 40},
                    cursor: "grab",
                    labelPermissibleInaccuracyOfVisibility: 2,
                    labelForceVisible: {"0_16": "dot", "17_21": "label"},
                },
            });
        }
        objectManager.add(areaObjects);
        mapRef.current.geoObjects.add(objectManager);
        new ymap.polylabel.create(mapRef.current, objectManager);
    };

    return (
        <div className="App">
            <header className="App-header">
                <p className="App-title">Снег всего {totalPayments} рублей</p>
            </header>
            <main className="App-main">
                <YMaps
                    query={{
                        ns: "ymaps",
                    }}
                >
                    <Map
                        {...mapState}
                        onLoad={(ymap) => getLabels(ymap)}
                        instanceRef={mapRef}
                    >
                        <FullscreenControl/>
                        <ZoomControl options={{
                            size: 'small', position: {
                                bottom: 'auto',
                                right: 10,
                                left: 'auto',
                                top: 150,
                            },
                        }}/>
                    </Map>

                </YMaps>
            </main>
        </div>
    );
}

export default App;
