// LISTA DE PAISES (ejemplo, podés poner los oficiales)
const paises = [
    "Argentina", "Brasil", "Francia", "Alemania",
    "España", "Inglaterra", "Portugal", "Holanda",
    "Uruguay", "Chile", "México", "EEUU",
    "Canadá", "Japón", "Corea", "Nigeria"
];

let mezclado = [];
let indexReveal = 0;

// REFERENCIAS
const cartasContainer = document.getElementById("cartasContainer");
const gruposContainer = document.getElementById("grupos");
const resultado = document.getElementById("resultado");

// MEZCLAR PAISES
function mezclar() {
    mezclado = [...paises].sort(() => Math.random() - 0.5);
}

// MOSTRAR CARTAS
function mostrarCartas() {
    cartasContainer.innerHTML = "";
    mezclado.forEach((pais, i) => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.textContent = "?";
        carta.onclick = () => revelarCarta(carta, pais);
        cartasContainer.appendChild(carta);
    });
}

// REVELAR CARTA MANUAL
function revelarCarta(carta, pais) {
    carta.classList.add("revelada");
    carta.textContent = pais;
    indexReveal++;

    if (indexReveal === paises.length) {
        generarGrupos();
    }
}

// SORTEO AUTOMÁTICO
function sorteoAutomatico() {
    mezclado.forEach((pais, i) => {
        const carta = cartasContainer.children[i];
        setTimeout(() => {
            carta.classList.add("revelada");
            carta.textContent = pais;
            if (i === mezclado.length - 1) generarGrupos();
        }, i * 300);
    });
}

// GENERAR GRUPOS
function generarGrupos() {
    resultado.style.display = "block";
    gruposContainer.innerHTML = "";

    let grupo = 0;
    for (let i = 0; i < mezclado.length; i += 4) {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>Grupo ${String.fromCharCode(65 + grupo)}</h3>
            <p>${mezclado[i]}</p>
            <p>${mezclado[i+1]}</p>
            <p>${mezclado[i+2]}</p>
            <p>${mezclado[i+3]}</p>
        `;
        gruposContainer.appendChild(div);
        grupo++;
    }
}

// CAPTURAR COMO IMAGEN
document.getElementById("btnShare").onclick = () => {
    html2canvas(document.getElementById("resultado")).then(canvas => {
        const link = document.createElement("a");
        link.download = "MiSimulacion.png";
        link.href = canvas.toDataURL();
        link.click();
    });
};

// EVENTOS BOTONES
document.getElementById("btnManual").onclick = () => {
    indexReveal = 0;
    mezclar();
    mostrarCartas();
};

document.getElementById("btnAuto").onclick = () => {
    indexReveal = 0;
    mezclar();
    mostrarCartas();
    setTimeout(sorteoAutomatico, 500);
};
