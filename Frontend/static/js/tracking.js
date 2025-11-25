// ============================
// CONFIGURACIÓN DEL MAPA
// ============================
const map = new maplibregl.Map({
    container: "mapa", // AHORA COINCIDE CON TU HTML
    style: {
        version: 8,
        sources: {
            osm: {
                type: "raster",
                tiles: [
                    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ],
                tileSize: 256
            }
        },
        layers: [
            {
                id: "osm-layer",
                type: "raster",
                source: "osm"
            }
        ]
    },
    center: [-68.845, -32.889], // Mendoza
    zoom: 12
});

// ============================
// CONFIGURACIÓN DE CAMIONES
// ============================

// Colores para los camiones
const coloresCamiones = [
    "#1E90FF", "#FF5733", "#2ECC71", "#9B59B6", "#F4D03F", "#E67E22", "#00BCD4"
];

// Cantidad de camiones a simular
const CANT_CAMIONES = 5;

// Crear camiones iniciales
let camiones = [];

for (let i = 0; i < CANT_CAMIONES; i++) {
    camiones.push({
        id: i + 1,
        lat: -32.889 + (Math.random() - 0.5) * 0.02,
        lon: -68.845 + (Math.random() - 0.5) * 0.02,
        velocidad: 0,
        detenido: false,
        alertas: 0,
        marker: new maplibregl.Marker({ color: coloresCamiones[i % coloresCamiones.length] })
            .setLngLat([-68.845, -32.889])
            .addTo(map)
    });
}

// ============================
// ACTUALIZAR TARJETAS
// ============================
function updateCards() {
    const activos = camiones.filter(c => !c.detenido).length;
    const detenidos = camiones.filter(c => c.detenido).length;

    let alertasTotales = 0;
    camiones.forEach(c => alertasTotales += c.alertas);

    document.getElementById("card-activos").textContent = activos;
    document.getElementById("card-detenidos").textContent = detenidos;
    document.getElementById("card-alertas").textContent = alertasTotales;
}

// ============================
// TIMELINE
// ============================
const timeline = document.getElementById("timeline");

function addEvent(texto) {
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong> — ${texto}`;
    timeline.prepend(item);
}

// ============================
// SIMULAR MOVIMIENTO DE CAMIONES
// ============================
setInterval(() => {

    camiones.forEach(c => {

        // Movimiento random suave
        let deltaLat = (Math.random() - 0.5) * 0.001;
        let deltaLon = (Math.random() - 0.5) * 0.001;

        c.lat += deltaLat;
        c.lon += deltaLon;

        // Velocidad random
        c.velocidad = Math.floor(Math.random() * 110);
        c.detenido = c.velocidad < 5;

        // Mover marcador
        c.marker.setLngLat([c.lon, c.lat]);

        // Alertas
        if (c.velocidad > 90) {
            c.alertas += 1;
            addEvent(`Camión ${c.id} en exceso de velocidad (${c.velocidad} km/h)`);
        }

        if (c.detenido && Math.random() < 0.05) {
            addEvent(`Camión ${c.id} detenido en zona de riesgo`);
        }

    });

    updateCards();

}, 1500);
