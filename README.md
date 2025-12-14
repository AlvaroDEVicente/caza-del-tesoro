# Caza del Tesoro - Proyecto Integrador DWEC

Este proyecto consiste en el desarrollo de un juego de tablero interactivo basado en navegador. El jugador controla a un personaje pirata que debe atravesar una cuadrícula de 10x10 para encontrar un cofre del tesoro en el menor número de tiradas posible.

## Descripcion

La aplicación es una "Single Page Application" (SPA) construida con HTML5, CSS3 y JavaScript Vanilla. El juego gestiona la lógica de movimiento, validación de formularios y persistencia de datos mediante localStorage para guardar récords y el historial del mejor jugador.

## Instalacion y Ejecucion

Este proyecto no requiere servidor (backend) ni instalación de dependencias externas.

1. Descargar: Clona este repositorio o descarga el archivo .zip con el código fuente.
2. Ejecutar: Abre el archivo index.html en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).

## Instrucciones de Uso

1. Inicio: Introduce tu nombre en el formulario. Debe tener un mínimo de 4 letras y no contener números.
2. Tablero: Una vez validado el nombre, pulsa el botón para acceder al mapa.
3. Jugar:
   - Pulsa el botón "TIRAR DADO" para obtener un número aleatorio entre 1 y 6.
   - Las casillas válidas para moverse se iluminarán en color rojo.
   - Haz clic en una casilla iluminada para mover al personaje.
4. Objetivo: Debes llegar a la casilla del cofre situada en la esquina inferior derecha del tablero.
5. Victoria: Al llegar al cofre, el juego te notificará el número de tiradas. Si superas el récord actual, quedarás registrado como el mejor jugador.

## Tecnologias Utilizadas

- HTML5: Estructura semántica de la aplicación.
- CSS3: Diseño Flexbox, animaciones, maquetación responsive y estilos visuales personalizados.
- JavaScript (ES6): Control de la lógica del juego, manipulación del DOM y gestión de eventos.
- LocalStorage: Implementación de persistencia de datos para guardar el récord del mejor jugador.

## Autor

Alvaro de Vicente Gómez - DWEC - Curso 2025/2026
