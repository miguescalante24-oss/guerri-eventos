
// =========================
// MENÚ DESPLEGABLE
// =========================

// Seleccionamos el botón y el menú
const botonMenu = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

// Abrimos o cerramos el menú al pulsar el botón
botonMenu.addEventListener("click", function() {

    menu.classList.toggle("activo");

    const estaAbierto = menu.classList.contains("activo");

    botonMenu.setAttribute("aria-expanded", estaAbierto);
    botonMenu.setAttribute(
        "aria-label",
        estaAbierto ? "Cerrar menú" : "Abrir menú"
    );

    botonMenu.textContent = estaAbierto ? "✕" : "☰";

});

// Cerramos el menú al seleccionar una sección
const enlaces = menu.querySelectorAll("a");

enlaces.forEach(function(enlace) {

    enlace.addEventListener("click", function() {

        menu.classList.remove("activo");

        botonMenu.textContent = "☰";
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.setAttribute("aria-label", "Abrir menú");

    });

});


// =========================
// FORMULARIO DE CONTACTO
// =========================

// Seleccionamos el formulario
const formulario = document.getElementById("formulario-contacto");

// Escuchamos el envío del formulario
formulario.addEventListener("submit", function(evento) {

    // Evitamos que la página se recargue
    evento.preventDefault();

    // Recogemos el nombre introducido
    const nombre = document.getElementById("nombre").value;

    // Seleccionamos el mensaje de respuesta
    const respuesta = document.getElementById("respuesta-formulario");

    // Mostramos una confirmación
    respuesta.textContent = "¡Gracias, " + nombre + "! Hemos recibido tus datos de prueba.";

    // Limpiamos el formulario
    formulario.reset();

});
