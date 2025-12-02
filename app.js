// ------------------------------
// DEFINICIÓN DE BOMBOS Y CONFEDERACIONES
// ------------------------------

const bombo1 = [
  "Canadá","Estados Unidos","México","Alemania","Argentina","Bélgica",
  "Brasil","España","Francia","Inglaterra","Países Bajos","Portugal"
];

const bombo2 = [
  "Australia","Austria","Colombia","Corea del Sur","Croacia","Ecuador",
  "Irán","Japón","Marruecos","Senegal","Suiza","Uruguay"
];

const bombo3 = [
  "Arabia Saudita","Argelia","Costa de Marfil","Egipto","Escocia","Noruega",
  "Panamá","Paraguay","Qatar","Sudáfrica","Túnez","Uzbekistán"
];

const bombo4 = [
  "Cabo Verde","Curazao","Ghana","Haití","Jordania","Nueva Zelanda",
  "Ganador Repechaje UEFA 1","Ganador Repechaje UEFA 2","Ganador Repechaje UEFA 3",
  "Ganador Repechaje UEFA 4","Ganador Repechaje Intercontinental 1",
  "Ganador Repechaje Intercontinental 2"
];

const confederaciones = {
  "Canadá":"CONCACAF","Estados Unidos":"CONCACAF","México":"CONCACAF",
  "Alemania":"UEFA","Argentina":"CONMEBOL","Bélgica":"UEFA",
  "Brasil":"CONMEBOL","España":"UEFA","Francia":"UEFA","Inglaterra":"UEFA",
  "Países Bajos":"UEFA","Portugal":"UEFA",
  "Australia":"AFC","Austria":"UEFA","Colombia":"CONMEBOL","Corea del Sur":"AFC",
  "Croacia":"UEFA","Ecuador":"CONMEBOL","Irán":"AFC","Japón":"AFC",
  "Marruecos":"CAF","Senegal":"CAF","Suiza":"UEFA","Uruguay":"CONMEBOL",
  "Arabia Saudita":"AFC","Argelia":"CAF","Costa de Marfil":"CAF","Egipto":"CAF",
  "Escocia":"UEFA","Noruega":"UEFA","Panamá":"CONCACAF","Paraguay":"CONMEBOL",
  "Qatar":"AFC","Sudáfrica":"CAF","Túnez":"CAF","Uzbekistán":"AFC",
  "Cabo Verde":"CAF","Curazao":"CONCACAF","Ghana":"CAF","Haití":"CONCACAF",
  "Jordania":"AFC","Nueva Zelanda":"OFC",
  "Ganador Repechaje UEFA 1":"UEFA","Ganador Repechaje UEFA 2":"UEFA",
  "Ganador Repechaje UEFA 3":"UEFA","Ganador Repechaje UEFA 4":"UEFA",
  "Ganador Repechaje Intercontinental 1":"CONMEBOL","Ganador Repechaje Intercontinental 2":"CONMEBOL"
};

// ------------------------------
// VARIABLES GLOBALES
// ------------------------------
const cartasContainer = document.getElementById("cartasContainer");
const cartaActual = document.getElementById("cartaActual");
const gruposContainer = document.getElementById("grupos");
const resultado = document.getElementById("resultado");

let bomboActual = 1;
let bomboLista = [...bombo1];
let grupos = Array.from({length:12}, ()=>[]);
let indexReveal = 0;

// ------------------------------
// FUNCIONES DE MEZCLADO Y SORTEO MANUAL
// ------------------------------
function mezclar(paises) {
    return [...paises].sort(() => Math.random() - 0.5);
}

function mostrarCartas(paises) {
    cartasContainer.innerHTML = "";
    paises.forEach((pais) => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.textContent = "?";
        carta.onclick = () => revelarCartaManual(carta, pais);
        cartasContainer.appendChild(carta);
    });
}

function revelarCartaManual(carta, pais) {
    carta.classList.add("revelada");
    carta.textContent = pais;
    indexReveal++;

    if (indexReveal === paises.length) {
        generarGruposFinales();
    }
}

// ------------------------------
// SORTEO AUTOMÁTICO
// ------------------------------
function sorteoAutomatico(paises) {
    paises.forEach((pais, i) => {
        const carta = cartasContainer.children[i];
        setTimeout(() => {
            carta.classList.add("revelada");
            carta.textContent = pais;
            if (i === paises.length - 1) generarGruposFinales();
        }, i * 300);
    });
}

// ------------------------------
// FUNCIONES DE GRUPOS EN TIEMPO REAL (BOMBOS Y REGLAS)
// ------------------------------
function renderGrupos() {
    gruposContainer.innerHTML = "";
    grupos.forEach((g,i)=>{
        const div = document.createElement("div");
        div.classList.add("grupo");
        div.innerHTML = `<h4>Grupo ${i+1}</h4>${g.map(p=>"<p>"+p+"</p>").join("")}`;
        gruposContainer.appendChild(div);
    });
}

function puedeAgregar(grupo, pais){
    const conf = confederaciones[pais];
    let cuentaUEFA = grupo.filter(p=>confederaciones[p]==="UEFA").length;
    let cuentaConf = grupo.filter(p=>confederaciones[p]===conf).length;

    if(conf==="UEFA" && cuentaUEFA>=2) return false;
    if(conf!=="UEFA" && cuentaConf>=1) return false;
    return true;
}

function siguienteBombo() {
    if(bomboLista.length===0){
        if(bomboActual===1) {bomboActual++; bomboLista=[...bombo2];}
        else if(bomboActual===2) {bomboActual++; bomboLista=[...bombo3];}
        else if(bomboActual===3) {bomboActual++; bomboLista=[...bombo4];}
        else {cartaActual.textContent="Sorteo terminado"; return;}
    }

    let elegido = bomboLista[Math.floor(Math.random()*bomboLista.length)];
    let grupoEncontrado = grupos.findIndex(g=>puedeAgregar(g,elegido) && g.length<4);
    if(grupoEncontrado===-1){
        alert("No se puede colocar "+elegido+" por confederación, se reintentará");
        return;
    }

    grupos[grupoEncontrado].push(elegido);
    cartaActual.textContent = elegido;
    bomboLista = bomboLista.filter(p=>p!==elegido);
    renderGrupos();
}

// ------------------------------
// PANEL FINAL PARA CAPTURA DE IMAGEN
// ------------------------------
function generarGruposFinales() {
    resultado.style.display = "block";
    const gruposFinales = document.getElementById("gruposFinales");
    gruposFinales.innerHTML = "";

    grupos.forEach((g,i)=>{
        const div = document.createElement("div");
        div.classList.add("grupo");
        div.innerHTML = `<h4>Grupo ${i+1}</h4>${g.map(p=>"<p>"+p+"</p>").join("")}`;
        gruposFinales.appendChild(div);
    });
}

// ------------------------------
// EVENTOS BOTONES
// ------------------------------
document.getElementById("btnManual").onclick = () => {
    indexReveal = 0;
    const paises = [...bombo1,bombo2,bombo3,bombo4];
    const mezclado = mezclar(paises);
    mostrarCartas(mezclado);
};

document.getElementById("btnAuto").onclick = () => {
    indexReveal = 0;
    const paises = [...bombo1,bombo2,bombo3,bombo4];
    const mezclado = mezclar(paises);
    mostrarCartas(mezclado);
    setTimeout(()=>sorteoAutomatico(mezclado),500);
};

document.getElementById("btnSiguiente").onclick = siguienteBombo;

document.getElementById("btnShare").onclick = () => {
    html2canvas(document.getElementById("resultado")).then(canvas => {
        const link = document.createElement("a");
        link.download = "MiSimulacion.png";
        link.href = canvas.toDataURL();
        link.click();
    });
};
