/* PROYECTO: CAZA DEL TESORO
 * Alumno: Álvaro
 * Descripción: Juego donde un pirata busca un tesoro en un mapa.
 */

// --- 1. VARIABLES GLOBALES (Datos que usamos en todo el juego) ---

let appContainer; // Aquí guardamos el div principal "app" para no buscarlo todo el rato

// 'estado' guarda toda la información de la partida actual
let estado = {
  nombre: "", // El nombre que escribe el usuario
  posicionPirata: { x: 0, y: 0 }, // Dónde está el pirata ahora mismo
  posicionCofre: { x: 9, y: 9 }, // Dónde está el tesoro
  numeroTiradas: 0, // Cuántas veces hemos tirado el dado

  // RÉCORD: Intentamos leer si hay un récord guardado en el navegador.
  // 'localStorage' es como una memoria del navegador que no se borra al cerrar.
  // Si no hay nada guardado, usamos null (vacío).
  recordTiradas: localStorage.getItem("recordCazaTesoro") || null,

  juegoActivo: false, // Para saber si estamos jugando o en el menú
};

const TAMANO_TABLERO = 10; // El tablero será de 10x10 casillas
let tableroLogico = []; // Aquí guardaremos el mapa en forma de datos (ceros y unos)

// --- 2. CUANDO SE CARGA LA PÁGINA ---

window.onload = function () {
  // Guardamos la referencia al div principal
  appContainer = document.getElementById("app");
  // Mostramos la primera pantalla
  cargarPantallaInicio();
};

// --- 3. PANTALLAS (Lo que ve el usuario) ---

/**
 * Pantalla 1: Inicio.
 * Muestra el campo para poner el nombre y las instrucciones.
 */
function cargarPantallaInicio() {
  appContainer.innerHTML = ""; // Borramos lo que hubiera antes

  // Creamos el título
  let titulo = document.createElement("h1");
  titulo.textContent = "Caza del Tesoro";
  titulo.className = "titulo-inicio";

  // Creamos el hueco para el formulario
  let contenedorInput = document.createElement("div");
  contenedorInput.className = "contenedor-input-inicio";

  let labelNombre = document.createElement("label");
  labelNombre.textContent = "Introduce tu nombre: ";
  labelNombre.style.display = "block";

  let inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.placeholder = "Mínimo 4 letras";
  inputNombre.id = "input-nombre";

  let botonNombre = document.createElement("button");
  botonNombre.textContent = "¡ZARPAR!";

  let pError = document.createElement("p");
  pError.className = "texto-error"; // Para mostrar mensajes si se equivoca

  // Cuando hacen click, comprobamos si el nombre vale
  botonNombre.addEventListener("click", function () {
    validarNombre(inputNombre.value, pError);
  });

  // Creamos el cuadro de reglas
  let cajaInstrucciones = document.createElement("div");
  cajaInstrucciones.className = "caja-instrucciones";
  cajaInstrucciones.innerHTML = `
        <h3>CÓDIGO PIRATA (REGLAS)</h3>
        <ul>
            <li>1. <strong>Tira el dado</strong> para ver cuánto avanzas.</li>
            <li>2. <strong>Muévete</strong> por las casillas iluminadas.</li>
            <li>3. <strong>Llega al cofre</strong> del tesoro.</li>
            <li>4. <strong>¡Hazlo rápido!</strong> El menor número de tiradas gana.</li>
        </ul>
    `;

  // Metemos todo dentro de la caja y luego en la página
  contenedorInput.appendChild(labelNombre);
  contenedorInput.appendChild(inputNombre);
  contenedorInput.appendChild(botonNombre);
  contenedorInput.appendChild(pError);

  appContainer.appendChild(titulo);
  appContainer.appendChild(contenedorInput);
  appContainer.appendChild(cajaInstrucciones);
}

/**
 * Pantalla 2: Bienvenida.
 * Un paso intermedio para saludar al jugador antes de empezar.
 */
function cargarPantallaBienvenida() {
  appContainer.innerHTML = "";

  let h1Bienvenida = document.createElement("h1");
  h1Bienvenida.textContent = "¡Bienvenido, Capitán " + estado.nombre + "!";
  h1Bienvenida.className = "titulo-bienvenida";

  let botonJugar = document.createElement("button");
  botonJugar.textContent = "¡A por el tesoro!";
  botonJugar.className = "btn-grande";

  botonJugar.addEventListener("click", iniciarJuego);

  appContainer.appendChild(h1Bienvenida);
  appContainer.appendChild(botonJugar);
}

/**
 * Pantalla 3: El Juego Principal.
 * Aquí montamos la estructura de 2 columnas (Controles a la izquierda, Mapa a la derecha).
 */
function iniciarJuego() {
  estado.juegoActivo = true;
  appContainer.innerHTML = "";

  // Título dentro del juego
  let tituloJuego = document.createElement("h1");
  tituloJuego.textContent = "LA CAZA DEL TESORO";
  tituloJuego.className = "titulo-juego-mapa";

  // Contenedor que organiza todo en filas
  let layoutJuego = document.createElement("div");
  layoutJuego.id = "layout-juego";

  // --- COLUMNA IZQUIERDA (Botones y Datos) ---
  let colIzquierda = document.createElement("div");
  colIzquierda.className = "columna-izquierda";

  // 1. El Dado
  let panelDado = document.createElement("div");
  panelDado.className = "caja-ui panel-dado";
  panelDado.setAttribute("tabindex", "-1"); // Para que no se pueda seleccionar con Tab

  let imgDado = document.createElement("img");
  imgDado.src = "./assets/dado_inicial.png";
  imgDado.id = "img-dado";
  imgDado.className = "dado-visual";
  imgDado.ondragstart = function () {
    return false;
  }; // Para que no se pueda arrastrar la imagen

  let btnDado = document.createElement("button");
  btnDado.textContent = "TIRAR DADO";
  btnDado.id = "btn-dado";
  btnDado.addEventListener("click", tirarDado);

  panelDado.appendChild(imgDado);
  panelDado.appendChild(btnDado);

  // 2. La Bitácora (Puntos actuales)
  let panelPuntuacion = document.createElement("div");
  panelPuntuacion.className = "caja-ui panel-puntuacion";

  let labelPuntos = document.createElement("h3");
  labelPuntos.textContent = "BITÁCORA";

  let infoStatus = document.createElement("div");
  infoStatus.id = "info-status";
  infoStatus.innerHTML = actualizarTextoInfoHTML(); // Ponemos el texto inicial

  panelPuntuacion.appendChild(labelPuntos);
  panelPuntuacion.appendChild(infoStatus);

  // 3. El Historial (muestra al MEJOR PIRATA)
  let panelHistorial = document.createElement("div");
  panelHistorial.className = "caja-ui panel-historial";

  let labelHistorial = document.createElement("h3");
  labelHistorial.textContent = "MEJOR PIRATA";

  let listaHistorial = document.createElement("ul");
  listaHistorial.id = "lista-historial";
  // Llamamos a la función que recupera los datos guardados
  listaHistorial.innerHTML = obtenerHTMLHistorial();

  panelHistorial.appendChild(labelHistorial);
  panelHistorial.appendChild(listaHistorial);

  // Añadimos los 3 paneles a la columna izquierda
  colIzquierda.appendChild(panelDado);
  colIzquierda.appendChild(panelPuntuacion);
  colIzquierda.appendChild(panelHistorial);

  // --- COLUMNA DERECHA (El Tablero) ---
  let colDerecha = document.createElement("div");
  colDerecha.className = "columna-derecha";

  let contenedorTablero = document.createElement("div");
  contenedorTablero.id = "tablero-juego";

  colDerecha.appendChild(contenedorTablero);

  // Juntamos todo en la pantalla
  appContainer.appendChild(tituloJuego);
  layoutJuego.appendChild(colIzquierda);
  layoutJuego.appendChild(colDerecha);
  appContainer.appendChild(layoutJuego);

  // Preparamos los datos y dibujamos el mapa
  inicializarModelo();
  generarTablero();
}

// --- 4. LÓGICA DEL JUEGO (Cálculos y Validaciones) ---

function validarNombre(nombre, elementoError) {
  let errores = [];
  let regexNumeros = /\d/; // Esto busca si hay algún número

  elementoError.textContent = ""; // Limpiamos errores anteriores

  if (nombre.length < 4) {
    errores.push("El nombre debe tener al menos 4 letras");
  }

  if (regexNumeros.test(nombre)) {
    errores.push("No se permiten números");
  }

  // Si hay errores los mostramos, si no, avanzamos
  if (errores.length > 0) {
    elementoError.textContent = errores.join(" y ");
  } else {
    estado.nombre = nombre;
    cargarPantallaBienvenida();
  }
}

function inicializarModelo() {
  tableroLogico = [];
  // Creamos el tablero vacío (todo ceros)
  for (let i = 0; i < TAMANO_TABLERO; i++) {
    // Añadimos una fila de 10 ceros
    tableroLogico.push(new Array(TAMANO_TABLERO).fill(0));
  }

  // Ponemos al pirata y al cofre en sus sitios iniciales
  estado.posicionPirata = { x: 0, y: 0 };
  estado.posicionCofre = { x: 9, y: 9 };

  tableroLogico[0][0] = 1; // El 1 significa "Aquí está el Pirata"
  tableroLogico[9][9] = 2; // El 2 significa "Aquí está el Cofre"
}

// --- 5. DIBUJAR EL TABLERO ---

/**
 * Esta función borra el tablero y lo vuelve a crear entero
 * basándose en los datos de 'tableroLogico'.
 */
function generarTablero() {
  let contenedor = document.getElementById("tablero-juego");
  contenedor.innerHTML = ""; // Limpiamos lo anterior

  let tabla = document.createElement("table");

  // Recorremos las filas (Y)
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    let tr = document.createElement("tr");

    // Recorremos las columnas (X)
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      let td = document.createElement("td");
      td.className = "celda";

      let valor = tableroLogico[y][x];
      let img = document.createElement("img");

      // Decidimos qué imagen poner según el número en la matriz
      if (valor === 1) img.src = "./assets/pirata.png";
      else if (valor === 2) img.src = "./assets/cofre.png";
      else img.src = "./assets/suelo.png";

      // Si hacen click en esta celda, intentamos movernos allí
      td.addEventListener("click", function () {
        intentarMover(x, y);
      });

      td.appendChild(img);
      tr.appendChild(td);
    }
    tabla.appendChild(tr);
  }
  contenedor.appendChild(tabla);
}

// --- 6. JUGANDO (Dados y Moverse) ---

function tirarDado() {
  let btnDado = document.getElementById("btn-dado");
  btnDado.disabled = true; // Desactivamos botón para que no le den 2 veces

  // Sacamos un número del 1 al 6
  let resultado = Math.floor(Math.random() * 6) + 1;

  // Truco para reiniciar la animación del dado
  let imgDado = document.getElementById("img-dado");
  imgDado.classList.remove("rodando");
  void imgDado.offsetWidth; // Esto obliga al navegador a "darse cuenta" del cambio
  imgDado.classList.add("rodando");

  // Cambiamos la imagen del dado
  imgDado.src = "./assets/dado_" + resultado + ".png";

  // Calculamos a dónde podemos ir
  marcarPosiblesMovimientos(resultado);
}

/**
 * Esta función ilumina las casillas a las que podemos ir.
 * Recorre las 4 direcciones (Arriba, Abajo, Izq, Der).
 */
function marcarPosiblesMovimientos(distancia) {
  limpiarResaltados(); // Primero quitamos las luces verdes anteriores

  let x = estado.posicionPirata.x;
  let y = estado.posicionPirata.y;

  // Lista de direcciones: {dx, dy} es cuánto sumamos a X e Y
  let direcciones = [
    { dx: 0, dy: -1 }, // Arriba (Resta 1 a Y)
    { dx: 0, dy: 1 }, // Abajo  (Suma 1 a Y)
    { dx: -1, dy: 0 }, // Izquierda (Resta 1 a X)
    { dx: 1, dy: 0 }, // Derecha (Suma 1 a X)
  ];

  // 1. Recorremos las 4 direcciones una por una
  for (let i = 0; i < direcciones.length; i++) {
    let dir = direcciones[i]; // Cogemos la dirección actual

    // 2. Avanzamos paso a paso en esa dirección
    for (let paso = 1; paso <= distancia; paso++) {
      // Calculamos la siguiente casilla
      let nextX = x + dir.dx * paso;
      let nextY = y + dir.dy * paso;

      // COMPROBACIÓN IMPORTANTE:
      // Miramos si la casilla está DENTRO del tablero (entre 0 y 9)
      if (
        nextX >= 0 &&
        nextX < TAMANO_TABLERO &&
        nextY >= 0 &&
        nextY < TAMANO_TABLERO
      ) {
        // Si está dentro, la pintamos de verde
        pintarCeldaVerde(nextX, nextY);
      } else {
        // Si nos salimos del mapa, paramos de mirar en esta dirección
        // y pasamos a la siguiente (break rompe el bucle de 'paso')
        break;
      }
    }
  }
}

// Función pequeña para añadir la clase CSS que pone el borde verde/rojo
function pintarCeldaVerde(x, y) {
  let tabla = document.querySelector("#tablero-juego table");
  let celda = tabla.rows[y].cells[x];
  celda.classList.add("puede-moverse");
}

// Función para quitar todas las marcas verdes del tablero
function limpiarResaltados() {
  let iluminadas = document.querySelectorAll(".puede-moverse");
  iluminadas.forEach((celda) => celda.classList.remove("puede-moverse"));
}

function intentarMover(xDestino, yDestino) {
  let tabla = document.querySelector("#tablero-juego table");
  let celda = tabla.rows[yDestino].cells[xDestino];

  // Solo nos movemos si la celda tiene la clase "puede-moverse"
  if (!celda.classList.contains("puede-moverse")) return;

  // 1. Quitamos al pirata de donde estaba (ponemos un 0)
  tableroLogico[estado.posicionPirata.y][estado.posicionPirata.x] = 0;

  // 2. Actualizamos las coordenadas del pirata
  estado.posicionPirata.x = xDestino;
  estado.posicionPirata.y = yDestino;
  estado.numeroTiradas++; // Sumamos una tirada

  // Actualizamos el texto de la pantalla
  document.getElementById("info-status").innerHTML = actualizarTextoInfoHTML();

  // 3. ¿Hemos llegado al cofre?
  if (
    xDestino === estado.posicionCofre.x &&
    yDestino === estado.posicionCofre.y
  ) {
    gestionarVictoria();
  } else {
    // Si no hemos ganado, ponemos al pirata en la nueva casilla (un 1)
    tableroLogico[yDestino][xDestino] = 1;
    limpiarResaltados();
    generarTablero(); // Redibujamos

    // Reactivamos el dado para tirar otra vez
    let btnDado = document.getElementById("btn-dado");
    btnDado.disabled = false;
    document.getElementById("img-dado").classList.remove("rodando");
  }
}

// --- 7. GUARDAR DATOS Y GANAR ---

function actualizarTextoInfoHTML() {
  let html = "<strong>Capitán:</strong> " + estado.nombre + "<br><br>";
  html += "<strong>Tiradas:</strong> " + estado.numeroTiradas + "<br><br>";

  if (estado.recordTiradas) {
    html +=
      "<span style='color: #8b0000; font-weight:bold;'> Récord: " +
      estado.recordTiradas +
      "</span>";
  } else {
    html += "Sin récord";
  }
  return html;
}

/**
 * Esta función recupera la lista de partidas guardadas en el navegador.
 * Busca el récord absoluto (mínimo de tiradas) y muestra a ese jugador.
 */
function obtenerHTMLHistorial() {
  /* * EXPLICACIÓN DE DATOS GUARDADOS:
   * 1. localStorage guarda texto.
   * 2. 'JSON.parse' convierte ese texto otra vez en una lista de datos útil.
   * 3. Si no hay nada guardado (null), usamos una lista vacía [].
   */
  let historial = JSON.parse(localStorage.getItem("historialCazaTesoro")) || [];

  if (historial.length === 0) {
    return "<li style='list-style:none; color:#666;'>Sin registros.</li>";
  }

  // Ordenamos el array por tiradas (menor a mayor)
  historial.sort((a, b) => a.tiradas - b.tiradas);

  // Cogemos al mejor (el primero de la lista ordenada)
  let mejorPirata = historial[0];

  return `
    <li class="item-mejor-pirata">
        <strong style="font-size: 1.4em; color: #8b0000; display:block; margin-bottom:5px;">
            ${mejorPirata.nombre}
        </strong>
        <span> ${mejorPirata.tiradas} tiradas</span>
    </li>
  `;
}

function gestionarVictoria() {
  // Dibujamos al pirata encima del cofre
  tableroLogico[estado.posicionCofre.y][estado.posicionCofre.x] = 1;
  generarTablero();

  setTimeout(() => {
    let mensaje = "¡Tesoro encontrado en " + estado.numeroTiradas + " tiradas!";

    // 1. Comprobar si es Récord Personal
    if (!estado.recordTiradas || estado.numeroTiradas < estado.recordTiradas) {
      estado.recordTiradas = estado.numeroTiradas;
      // Guardamos el nuevo récord
      localStorage.setItem("recordCazaTesoro", estado.numeroTiradas);
      mensaje += "\n¡NUEVO RÉCORD!";
    } else {
      mensaje += "\nRécord actual: " + estado.recordTiradas;
    }

    // 2. Guardar en el Historial General
    let historial =
      JSON.parse(localStorage.getItem("historialCazaTesoro")) || [];

    // Añadimos la partida actual a la lista
    historial.push({
      nombre: estado.nombre,
      tiradas: estado.numeroTiradas,
      fecha: new Date().toLocaleDateString(),
    });

    /* * 'JSON.stringify' hace lo contrario a 'parse'.
     * Convierte nuestra lista de datos en un texto plano
     * para que el navegador pueda guardarlo en localStorage.
     */
    localStorage.setItem("historialCazaTesoro", JSON.stringify(historial));

    alert(mensaje);

    if (confirm("¿Jugar otra vez?")) location.reload();
  }, 100);
}
