<<<<<<< HEAD
async function cargarDatos() {
    const res = await fetch("../static/data/somnolencias.json");
    const datos = await res.json();
    return datos;
}

function renderTabla(lista) {
    const tabla = document.getElementById("tabla-somnolencias");
    tabla.innerHTML = "";

    lista.forEach(evento => {
        const fila = `
            <tr>
                <td>${evento.id}</td>
                <td>${evento.patente}</td>
                <td>${evento.fecha_hora}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("notificacion");
    const texto = document.getElementById("notificacion-text");
    if (!alerta) return;
    if (texto) texto.textContent = mensaje;
    alerta.classList.remove("d-none", "hiding");
    alerta.classList.add("showing");

    setTimeout(() => {
        alerta.classList.remove("showing");
        alerta.classList.add("hiding");
        // esconder definitivamente tras la animación
        setTimeout(() => alerta.classList.add("d-none"), 300);
    }, 4000);
}

function updateBadges(total, activos) {
    const bt = document.getElementById('badge-total');
    const ba = document.getElementById('badge-activos');
    if (bt) bt.textContent = total;
    if (ba) ba.textContent = activos;
}

// Simulación de llegada de nuevos eventos
async function iniciarSimulacion() {
    let datos = await cargarDatos();
    renderTabla(datos);
    // inicializar contadores
    let activos = 0;
    updateBadges(datos.length, activos);

    setInterval(async () => {
        // simular nueva somnolencia cada cierto tiempo
        const nuevoID = datos.length + 1;

        const nuevasSomnolencias = {
            id: nuevoID,
            patente: "Z" + Math.floor(Math.random() * 900 + 100), // patente trucha solo para la demo
            fecha_hora: new Date().toISOString().replace("T", " ").substring(0, 19)
        };

        datos.push(nuevasSomnolencias);
        // actualizar tabla y contadores
        renderTabla(datos);
        activos += 1;
        updateBadges(datos.length, activos);

        mostrarNotificacion("Se ha detectado una somnolencia");

    }, 8000); // cada 8 segundos
}

iniciarSimulacion();
=======
async function cargarDatos() {
    const res = await fetch("http://localhost:8080/somnolencias");
    const datos = await res.json();
    return datos;
}

async function renderTabla() {
    const lista = await cargarDatos();
    const tabla = document.getElementById("tabla-somnolencias");
    tabla.innerHTML = "";

    lista.forEach(evento => {
        const fila = `
            <tr>
                <td>${evento.id}</td>
                <td>${evento.patente}</td>
                <td>${evento.fecha_hora}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
    cantSomnolencias = lista.length;
    setBadges(cantSomnolencias);
}

var cantSomnolencias = 0;

function setBadges(cantSomnolencias){
    const bt = document.getElementById('badge-total');
    if (bt) bt.textContent = cantSomnolencias;
}

function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("notificacion");
    const texto = document.getElementById("notificacion-text");
    if (!alerta) return;
    if (texto) texto.textContent = mensaje;
    alerta.classList.remove("d-none", "hiding");
    alerta.classList.add("showing");

    setTimeout(() => {
        alerta.classList.remove("showing");
        alerta.classList.add("hiding");
        // esconder definitivamente tras la animación
        setTimeout(() => alerta.classList.add("d-none"), 300);
    }, 4000);
}

let stompClient = null;

function conectarWebSocket() {
    const canalws = new SockJS("http://localhost:8080/somnolenciaAlert");
    stompClient = Stomp.over(canalws);

    stompClient.connect({}, frame => {
        stompClient.subscribe("/topic/somnolenciaAlert", mensaje => {
	    console.log("Somnolencia recibida");
            const somnolencia = JSON.parse(mensaje.body);
            agregarFila(somnolencia);
            mostrarNotificacion("Se ha detectado una somnolencia");
	    cantSomnolencias++;
            setBadges(cantSomnolencias);
        });
    }, () => {
        setTimeout(conectarWebSocket, 3000);
    });

function agregarFila(somnolencia) {
    const tabla = document.getElementById("tabla-somnolencias");
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${somnolencia.id}</td>
        <td>${somnolencia.patente}</td>
        <td>${somnolencia.fecha_hora}</td>
    `;

    tabla.prepend(fila);
}

document.addEventListener("DOMContentLoaded", () => {
    conectarWebSocket();
    renderTabla();
});
>>>>>>> 59f72 (Conexion con el backend por websocket)
