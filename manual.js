// Bombo 1 (cabezas de serie)
let bombo1 = [
    "España", "Argentina", "Francia", "Inglaterra",
    "Brasil", "Portugal", "Países Bajos", "Bélgica",
    "Alemania"
];

// Países anfitriones ya asignados
const gruposAsignados = {
    "Grupo A": ["México"],
    "Grupo B": ["Canadá"],
    "Grupo D": ["Estados Unidos"]
};

// Grupos vacíos restantes
const grupos = [
    "Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
    "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L"
];

// Bloques opuestos para España y Argentina
const bloqueOpuesto = {
    "España": ["GrupoG","GrupoH","GrupoI","GrupoJ","GrupoK","GrupoL"], // si España sale primero
    "Argentina": ["GrupoC","GrupoE","GrupoF","GrupoG","GrupoH","GrupoI","GrupoJ","GrupoK","GrupoL"]
};

// Función para mezclar un array
function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Genera las cartas
function generarCartas() {
    const contenedor = document.getElementById("bombo1");
    contenedor.innerHTML = "";
    bombo1 = mezclar(bombo1);

    bombo1.forEach(pais => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.textContent = "???";
        carta.dataset.pais = pais;

        carta.addEventListener("click", () => {
            revelarCarta(carta);
        });

        contenedor.appendChild(carta);
    });
}

// Al revelar carta
function revelarCarta(carta) {
    carta.classList.add("revelada");
    carta.textContent = carta.dataset.pais;

    // Asigna país al grupo correspondiente según reglas
    asignarGrupo(carta.dataset.pais);

    // Quitar del bombo y regenerar cartas
    bombo1 = bombo1.filter(p => p !== carta.dataset.pais);
    setTimeout(generarCartas, 500);
}

// Función para asignar país a grupo según reglas
function asignarGrupo(pais) {
    // Restricción España-Argentina
    if (pais === "España" || pais === "Argentina") {
        const posibles = bloqueOpuesto[pais];
        let grupoElegido = posibles.find(g => !gruposAsignados[g] || gruposAsignados[g].length === 0);
        
        // Si el grupo está ocupado por el otro país, intercambiamos
        if (grupoElegido && gruposAsignados[grupoElegido] && gruposAsignados[grupoElegido][0] === (pais === "España" ? "Argentina" : "España")) {
            const grupoOriginal = Object.keys(gruposAsignados).find(g => gruposAsignados[g][0] === (pais === "España" ? "Argentina" : "España"));
            gruposAsignados[grupoOriginal] = [pais];
            actualizarGrupoVisual(grupoOriginal, pais);
            gruposAsignados[grupoElegido] = [(pais === "España" ? "Argentina" : "España")];
            actualizarGrupoVisual(grupoElegido, (pais === "España" ? "Argentina" : "España"));
            return;
        }

        // Asigna al primer grupo disponible en bloque opuesto
        if (!gruposAsignados[grupoElegido]) gruposAsignados[grupoElegido] = [];
        gruposAsignados[grupoElegido].push(pais);
        actualizarGrupoVisual(grupoElegido, pais);
        return;
    }

    // Países normales (primer grupo disponible)
    for (let grupo of grupos) {
        if (!gruposAsignados[grupo]) gruposAsignados[grupo] = [];
        if (gruposAsignados[grupo].length === 0) {
            gruposAsignados[grupo].push(pais);
            actualizarGrupoVisual(grupo, pais);
            break;
        }
    }
}

// Actualiza visualmente los grupos
function actualizarGrupoVisual(grupo, pais) {
    const ul = document.querySelector(`#${grupo.toLowerCase()} ul`);
    const li = document.createElement("li");
    li.textContent = pais;
    ul.appendChild(li);
}

// Inicializamos
generarCartas();
