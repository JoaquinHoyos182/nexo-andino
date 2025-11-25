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
