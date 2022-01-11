import "./App.css";
import { YMaps, Map } from "react-yandex-maps";
import { useRef } from "react";
import { areasByUsage as areas } from "./areas";
import paidForSnow from "./paid";

const LIMIT = 3000;

const COLORS = {
  inactive: { background: "#F0F0F0", border: "#a3a3a3" },
  warning: { background: "#F6D55C", border: "#a3a3a3" },
  error: { background: "ED553B", border: "#a3a3a3" },
  success: { background: "3CAEA3", border: "#a3a3a3" },
};

const getAreaColorAndPaid = (area, data) => {
  const areaData = data.filter((a) => a.number === area.number);
  let color = COLORS.inactive;
  let paid = NaN;
  if (areaData.length) {
    paid = areaData[0].paid;
    if (paid === 0) color = COLORS.error;
    if (paid > 0 && paid < LIMIT) color = COLORS.warning;
    if (paid >= LIMIT) color = COLORS.success;
  }
  return {
    paid,
    color,
  };
};

const mapState = {
  state: { center: [55.486586, 37.609443], zoom: 17.6 },
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
      document.head
    );
    loadJS(
      "polylabel",
      "https://yastatic.net/s3/mapsapi-jslibs/polylabeler/1.0.2/polylabel.min.js",
      document.head,
      () => getLands(ymaps)
    );
  };

  const getLands = async (ymap) => {
    await ymap.ready(["polylabel.create"]);
    const objectManager = new ymap.ObjectManager();
    const areaOjects = [];

    for (const area of areas) {
      const { paid, color } = getAreaColorAndPaid(area, paidForSnow);
      areaOjects.push({
        type: "Feature",
        id: area.number,
        geometry: {
          type: "Polygon",
          coordinates: [area.coords],
        },
        options: {
          fillColor: color.background,
          strokeColor: color.border,
          opacity: 0.5,
          strokeWidth: 2,
          strokeStyle: "solid",
          labelLayout: isNaN(paid)
            ? `<div class="land-label"></div>`
            : `<div class="land-label">${paid}</div>`,
          labelTextSize: { "18_20": 18, "20_21": 40 },
          cursor: "grab",
          labelPermissibleInaccuracyOfVisibility: 2,
          labelForceVisible: { "0_18": "dot", "18_21": "label" },
        },
      });
    }
    objectManager.add(areaOjects);
    mapRef.current.geoObjects.add(objectManager);
    new ymap.polylabel.create(mapRef.current, objectManager);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Сборы средст на уборку снега</h1>
      </header>
      <main className='App-main'>
        <YMaps
          query={{
            ns: "ymaps",
          }}
        >
          <Map
            {...mapState}
            onLoad={(ymap) => getLabels(ymap)}
            instanceRef={mapRef}
          ></Map>
        </YMaps>
      </main>
    </div>
  );
}

export default App;
