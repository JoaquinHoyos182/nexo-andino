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
    alerta.textContent = mensaje;
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 4000);
}

// Simulación de llegada de nuevos eventos
async function iniciarSimulacion() {
    let datos = await cargarDatos();
    renderTabla(datos);

    setInterval(async () => {
        // simular nueva somnolencia cada cierto tiempo
        const nuevoID = datos.length + 1;

        const nuevasSomnolencias = {
            id: nuevoID,
            patente: "Z" + Math.floor(Math.random() * 900 + 100), // patente trucha solo para la demo
            fecha_hora: new Date().toISOString().replace("T", " ").substring(0, 19)
        };

        datos.push(nuevasSomnolencias);
        renderTabla(datos);

        mostrarNotificacion("⚠️ Se ha detectado una somnolencia");

    }, 8000); // cada 8 segundos
}

iniciarSimulacion();
