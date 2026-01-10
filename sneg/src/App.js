import "./App.css";
import {FullscreenControl, Map, YMaps, ZoomControl} from "react-yandex-maps";
import {useEffect, useMemo, useRef, useState} from "react";

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
        lands
        payments {
          id
          land {
            id
          }
          amount
        }
      }
      lands: land {
        id
        polygon
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
    state: {center: [55.486586, 37.609443], zoom: 16.6},
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
    const ymapsRef = useRef(null);

    const [targets, setTargets] = useState([])
    const [selectedTargetId, setSelectedTargetId] = useState(null)
    const [allLands, setAllLands] = useState()

    useEffect(() => {
        const loadData = async () => {
            const {errors, data} = await fetchTargets();

            if (errors) {
                console.error(errors);

                return
            }

            setTargets(data.targets)
            setAllLands(data.lands)
            // По умолчанию выбираем первый target
            if (data.targets.length > 0) {
                setSelectedTargetId(data.targets[0].id)
            }
        }

        loadData()
    }, [])

    const {lands, totalPayments, target} = useMemo(() => {
        if (!allLands || targets.length === 0 || !selectedTargetId) {
            return {lands: {}, totalPayments: 0, target: null}
        }

        const target = targets.find(t => t.id === selectedTargetId)
        
        let polygons = {}
        for (const land of allLands) {
            polygons[land.id] = land.polygon?.replace('((', '').replace('))', '').split('),(').map(i => i.split(',').map(c => parseFloat(c)))
        }

        let totalPayments = 0
        let lands = {}
        for (const payment of target.payments) {
            totalPayments += payment.amount
            const land = payment.land;

            if (!land) {
                // Платежи без land (корректировки, возвраты) не привязываются к участкам
                continue
            }

            if (typeof lands[land.id] === 'undefined') {
                lands[land.id] = {
                    id: land.id,
                    paid: payment.amount,
                    polygon: polygons[land.id],
                }
            } else {
                lands[land.id].paid += payment.amount
            }
        }
        for (const id of target.lands) {
            if (typeof lands[id] === 'undefined') {
                lands[id] = {
                    id: id,
                    paid: 0,
                    polygon: polygons[id],
                }
            }
        }

        return {lands, totalPayments, target}
    }, [allLands, targets, selectedTargetId])

    const updateMap = async () => {
        if (!ymapsRef.current || !mapRef.current || !target) {
            return;
        }

        const ymap = ymapsRef.current;
        
        // Очищаем все объекты с карты
        mapRef.current.geoObjects.removeAll();

        await ymap.ready(["polylabel.create"]);
        const objectManager = new ymap.ObjectManager({clusterize: false});
        const areaObjects = [];

        for (const id in lands) {
            const land = lands[id]

            if (land.polygon === undefined) {
                // Участок без координат не может быть отображен на карте
                continue;
            }

            const color = getAreaColor(land.paid, target.payer_amount);

            areaObjects.push({
                type: "Feature",
                id: land.id,
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

    useEffect(() => {
        updateMap();
    }, [lands, target]);

    if (!target) {
        return null
    }

    const getLabels = (ymaps) => {
        ymapsRef.current = ymaps;
        
        loadJS(
            "calculateArea",
            "https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js",
            document.head,
        );
        loadJS(
            "polylabel",
            "https://yastatic.net/s3/mapsapi-jslibs/polylabeler/1.0.2/polylabel.min.js",
            document.head,
            () => updateMap()
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <p className="App-title">Снег всего {totalPayments} рублей</p>
                <select 
                    value={selectedTargetId} 
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="target-selector"
                >
                    {targets.map(target => (
                        <option key={target.id} value={target.id}>
                            {target.name}
                        </option>
                    ))}
                </select>
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
