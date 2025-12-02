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
const cartaActual = document.getElementById("cartaActual");
const gruposContainer = document.getElementById("grupos");
const resultado = document.getElementById("resultado");
const cartasContainer = document.getElementById("cartasContainer");

let grupos = Array.from({length:12}, ()=>[]);
let bomboActual = 1;
let bomboLista = [...bombo1];
let indexReveal = 0;

// ------------------------------
// FUNCIONES AUXILIARES
// ------------------------------
function mezclar(array){
  return [...array].sort(()=>Math.random()-0.5);
}

function puedeAgregar(grupo, pais){
  const conf = confederaciones[pais];
  let cuentaUEFA = grupo.filter(p=>confederaciones[p]==="UEFA").length;
  let cuentaConf = grupo.filter(p=>confederaciones[p]===conf).length;

  if(conf==="UEFA" && cuentaUEFA>=2) return false;
  if(conf!=="UEFA" && cuentaConf>=1) return false;
  return true;
}

function renderGrupos(){
  gruposContainer.innerHTML="";
  grupos.forEach((g,i)=>{
    const div = document.createElement("div");
    div.classList.add("grupo");
    div.innerHTML=`<h4>Grupo ${String.fromCharCode(65+i)}</h4>${g.map(p=>"<p>"+p+"</p>").join("")}`;
    gruposContainer.appendChild(div);
  });
}

// ------------------------------
// COLOCAR CABEZAS DE SERIE (BOMBO 1)
// ------------------------------
function colocarCabezasDeSerie(){
  let bombo1mezclado = mezclar(bombo1);
  for(let i=0;i<12;i++){
    grupos[i].push(bombo1mezclado[i]);
  }
  renderGrupos();
}

// ------------------------------
// SORTEO MANUAL POR BOMBO
// ------------------------------
function mostrarCartas(bombo){
  cartasContainer.innerHTML="";
  let bomboMezclado = mezclar(bombo);
  bomboMezclado.forEach(pais=>{
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.textContent="?";
    carta.onclick=()=>{
      colocarPaisEnGrupo(pais);
      carta.classList.add("revelada");
      carta.textContent=pais;
      carta.disabled=true;
    };
    cartasContainer.appendChild(carta);
  });
}

function colocarPaisEnGrupo(pais){
  let grupoEncontrado = grupos.findIndex(g=>puedeAgregar(g,pais) && g.length<4);
  if(grupoEncontrado===-1){
    alert("No se puede colocar "+pais+" por confederación");
    return;
  }
  grupos[grupoEncontrado].push(pais);
  renderGrupos();
}

// ------------------------------
// SORTEO AUTOMÁTICO POR BOMBO
// ------------------------------
function sorteoAutomaticoBombo(bombo, delay=500){
  let bomboMezclado = mezclar(bombo);
  bomboMezclado.forEach((pais,i)=>{
    setTimeout(()=>{
      colocarPaisEnGrupo(pais);
      cartaActual.textContent=pais;
      if(i===bomboMezclado.length-1 && bombo===bombo4){
        resultado.style.display="block";
      }
    }, i*delay);
  });
}

// ------------------------------
// EVENTOS BOTONES
// ------------------------------
document.getElementById("btnManual").onclick=()=>{
  cartasContainer.innerHTML="";
  if(bomboActual===1) colocarCabezasDeSerie();
  if(bomboActual===2) mostrarCartas(bombo2);
  if(bomboActual===3) mostrarCartas(bombo3);
  if(bomboActual===4) mostrarCartas(bombo4);
};

document.getElementById("btnAuto").onclick=()=>{
  cartasContainer.innerHTML="";
  if(bomboActual===1){
    colocarCabezasDeSerie();
    bomboActual++;
  }
  sorteoAutomaticoBombo(bombo2);
  setTimeout(()=>sorteoAutomaticoBombo(bombo3),bombo2.length*500+200);
  setTimeout(()=>sorteoAutomaticoBombo(bombo4), (bombo2.length+bombo3.length)*500+400);
};

document.getElementById("btnSiguiente").onclick=()=>{
  if(bomboActual===1){
    colocarCabezasDeSerie();
    bomboActual++;
  } else if(bomboActual===2){
    mostrarCartas(bombo2);
    bomboActual++;
  } else if(bomboActual===3){
    mostrarCartas(bombo3);
    bomboActual++;
  } else if(bomboActual===4){
    mostrarCartas(bombo4);
    bomboActual++;
  } else {
    cartaActual.textContent="Sorteo terminado";
  }
};

// ------------------------------
// BOTÓN PARA CAPTURAR IMAGEN
// ------------------------------
document.getElementById("btnShare").onclick=()=>{
  html2canvas(document.getElementById("resultado")).then(canvas=>{
    const link = document.createElement("a");
    link.download="MiSimulacion.png";
    link.href=canvas.toDataURL();
    link.click();
  });
};
