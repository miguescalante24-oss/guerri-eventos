// =====================================================
// ⚙️ CONFIGURACIÓN — rellena esto y la web queda lista
// =====================================================
const CONFIG = {
    // Correo donde recibirás las solicitudes (se abre el correo del cliente ya redactado)
    email: "tucorreo@ejemplo.com",

    // WhatsApp con prefijo de país y sin signos. Ej: "34600123456". Vacío = botón oculto
    whatsapp: "",

    // OPCIONAL (recomendado): envío directo sin abrir el correo.
    // Crea un formulario gratis en https://formspree.io y pega aquí su URL.
    // Ej: "https://formspree.io/f/xxxxxxxx". Si lo dejas vacío se usa el correo.
    endpoint: ""
};


// =========================
// MENÚ DESPLEGABLE
// =========================

const cabecera = document.querySelector("header");
const botonMenu = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const enlaces = menu.querySelectorAll("a");

function cambiarMenu(abrir) {
    menu.classList.toggle("activo", abrir);
    botonMenu.textContent = abrir ? "✕" : "☰";
    botonMenu.setAttribute("aria-expanded", abrir);
    botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
}

botonMenu.addEventListener("click", () => cambiarMenu(!menu.classList.contains("activo")));
enlaces.forEach(enlace => enlace.addEventListener("click", () => cambiarMenu(false)));

// Cerrar con Escape o al pulsar fuera
document.addEventListener("keydown", e => { if (e.key === "Escape") cambiarMenu(false); });
document.addEventListener("click", e => { if (!cabecera.contains(e.target)) cambiarMenu(false); });


// =========================
// SCROLL: barra de progreso, cabecera, enlace activo y botón "arriba"
// =========================

const progreso = document.getElementById("progreso");
const botonArriba = document.getElementById("arriba");
const secciones = [...enlaces].map(a => document.querySelector(a.getAttribute("href")));

function alHacerScroll() {
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    progreso.style.width = (total > 0 ? (y / total) * 100 : 0) + "%";
    cabecera.classList.toggle("compacta", y > 40);
    botonArriba.hidden = y < 700;

    // Sección visible = la última cuya parte superior ya pasó la cabecera
    let actual = 0;
    secciones.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) actual = i; });
    if (total > 0 && y >= total - 4) actual = secciones.length - 1;
    enlaces.forEach((a, i) => a.classList.toggle("actual", i === actual && y > 40));
}

let pendiente = false;
window.addEventListener("scroll", () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { alHacerScroll(); pendiente = false; });
}, { passive: true });
alHacerScroll();

botonArriba.addEventListener("click", () => window.scrollTo({ top: 0 }));


// =========================
// PORTADA: foco de luz que sigue al cursor
// =========================

const portada = document.getElementById("inicio");
portada.addEventListener("pointermove", e => {
    const caja = portada.getBoundingClientRect();
    portada.style.setProperty("--x", (e.clientX - caja.left) + "px");
    portada.style.setProperty("--y", (e.clientY - caja.top) + "px");
});


// =========================
// APARICIÓN AL HACER SCROLL
// =========================

const elementos = document.querySelectorAll(
    "#servicios > *, #proceso > *, #nosotros > *, #galeria > *, #contacto > *, .servicio, .paso, .valores li, .foto"
);

if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
        });
    }, { threshold: 0.12 });

    elementos.forEach(el => {
        // Los elementos de una cuadrícula entran escalonados
        const hermanos = [...el.parentElement.children];
        const esCuadricula = el.matches(".servicio, .paso, .valores li, .foto");
        el.style.transitionDelay = esCuadricula ? (hermanos.indexOf(el) % 3) * 90 + "ms" : "0ms";
        el.classList.add("reveal");
        observador.observe(el);
    });
}


// =========================
// GALERÍA: imágenes rotas y visor ampliado
// =========================

const visor = document.getElementById("visor");
const visorImg = visor.querySelector("img");
const visorTexto = document.getElementById("visor-texto");

document.querySelectorAll(".foto").forEach(foto => {
    const img = foto.querySelector("img");
    const marcarRota = () => foto.classList.add("sin-imagen");

    img.addEventListener("error", marcarRota);
    if (img.complete && img.naturalWidth === 0) marcarRota();

    img.addEventListener("click", () => {
        visorImg.src = img.currentSrc || img.src;
        visorImg.alt = img.alt;
        visorTexto.textContent = foto.querySelector("h3").textContent + " — " + foto.querySelector("p").textContent;
        visor.showModal();
    });
});

document.getElementById("visor-cerrar").addEventListener("click", () => visor.close());
visor.addEventListener("click", e => { if (e.target === visor) visor.close(); });


// =========================
// WHATSAPP Y PIE DE PÁGINA
// =========================

const numero = CONFIG.whatsapp.replace(/\D/g, "");
const botonWhatsapp = document.getElementById("whatsapp");

if (numero.length >= 9) {
    botonWhatsapp.href = "https://wa.me/" + numero + "?text=" +
        encodeURIComponent("Hola, me gustaría pedir información para un evento.");
    botonWhatsapp.hidden = false;
}

const pie = document.getElementById("footer-contacto");
if (CONFIG.email && !CONFIG.email.includes("ejemplo.com")) {
    pie.innerHTML = '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a>";
}
if (numero.length >= 9) {
    pie.innerHTML += '<a href="https://wa.me/' + numero + '" target="_blank" rel="noopener">WhatsApp</a>';
}


// =========================
// FORMULARIO DE CONTACTO
// =========================

const formulario = document.getElementById("formulario-contacto");
const respuesta = document.getElementById("respuesta-formulario");
const botonEnviar = formulario.querySelector("button[type='submit']");

const mensajes = {
    nombre: "Escribe tu nombre.",
    email: "Escribe un correo válido, por ejemplo nombre@correo.com.",
    evento: "Elige el tipo de evento.",
    mensaje: "Cuéntanos brevemente qué tienes en mente."
};

function validar() {
    let primerError = null;

    formulario.querySelectorAll(".campo").forEach(campo => {
        const control = campo.querySelector("input, select, textarea");
        const antiguo = campo.querySelector(".mensaje-error");
        if (antiguo) antiguo.remove();
        campo.classList.remove("error");
        control.removeAttribute("aria-invalid");

        const vacio = !control.value.trim();
        if (vacio || !control.checkValidity()) {
            const aviso = document.createElement("span");
            aviso.className = "mensaje-error";
            aviso.textContent = mensajes[control.name];
            campo.appendChild(aviso);
            campo.classList.add("error");
            control.setAttribute("aria-invalid", "true");
            if (!primerError) primerError = control;
        }
    });

    if (primerError) primerError.focus();
    return !primerError;
}

// Quitar el error en cuanto la persona corrige el campo
formulario.addEventListener("input", e => {
    const campo = e.target.closest(".campo");
    if (!campo || !campo.classList.contains("error")) return;
    campo.classList.remove("error");
    e.target.removeAttribute("aria-invalid");
    const aviso = campo.querySelector(".mensaje-error");
    if (aviso) aviso.remove();
});

function mostrar(texto, esError) {
    respuesta.textContent = texto;
    respuesta.classList.toggle("error", !!esError);
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mostrar("");

    if (!validar()) return;

    const datos = new FormData(formulario);

    // Si un bot rellenó el campo trampa, fingimos éxito y no enviamos nada
    if (datos.get("web")) { formulario.reset(); return; }

    const nombre = datos.get("nombre").trim();

    // Opción A: envío directo con un servicio de formularios
    if (CONFIG.endpoint) {
        botonEnviar.disabled = true;
        botonEnviar.textContent = "ENVIANDO...";
        try {
            const r = await fetch(CONFIG.endpoint, {
                method: "POST",
                body: datos,
                headers: { Accept: "application/json" }
            });
            if (!r.ok) throw new Error("Respuesta " + r.status);
            mostrar("¡Gracias, " + nombre + "! Hemos recibido tu mensaje y te responderemos pronto.");
            formulario.reset();
        } catch (error) {
            mostrar("No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos por correo.", true);
        } finally {
            botonEnviar.disabled = false;
            botonEnviar.textContent = "ENVIAR MENSAJE";
        }
        return;
    }

    // Opción B: abrir el correo del cliente con el mensaje ya redactado
    const asunto = "Solicitud de presupuesto: " + datos.get("evento");
    const cuerpo =
        "Nombre: " + nombre + "\n" +
        "Correo: " + datos.get("email") + "\n" +
        "Tipo de evento: " + datos.get("evento") + "\n\n" +
        datos.get("mensaje");

    window.location.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent(asunto) +
        "&body=" + encodeURIComponent(cuerpo);

    mostrar("¡Gracias, " + nombre + "! Se abrirá tu aplicación de correo con el mensaje listo. Solo tienes que pulsar enviar.");
});