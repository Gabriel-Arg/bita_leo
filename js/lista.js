// Cantidad de tarjetas por página
const POR_PAGINA = 6;

// Elementos de la página
const contenedor = document.querySelector('.box_hijo_2');
const zonaNumeros = document.getElementById('numeros');
const btnAtras = document.getElementById('btn_atras');
const btnSiguiente = document.getElementById('btn_siguiente');
const campoBusqueda = document.getElementById('buscador');
const btnBuscar = document.getElementById('btn_buscar');

// Elementos del panel lateral de filtro
const btnMenu = document.getElementById('btn_menu');
const filtroPanel = document.getElementById('filtro_panel');
const filtroFondo = document.getElementById('filtro_fondo');
const filtroCerrar = document.getElementById('filtro_cerrar');
const listaGrupos = document.getElementById('lista_grupos');

// La lista que se está mostrando (al principio, todas) y la página actual
let listaActual = publicaciones;
let paginaActual = 1;

// El grupo elegido en el menú ('' significa "todos")
let grupoActual = '';

// Cuántas páginas hay para la lista que se está mostrando
function totalPaginas() {
    return Math.ceil(listaActual.length / POR_PAGINA);
}

// Pasa a minúsculas y quita las tildes, para comparar sin diferencias
function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Filtra la lista según el grupo elegido y lo escrito en el buscador
function filtrar() {
    const palabras = normalizar(campoBusqueda.value)
        .split(' ')
        .filter(function (palabra) {
            return palabra !== '';
        });

    listaActual = publicaciones.filter(function (pub) {
        // Si hay un grupo elegido, la publicación debe pertenecer a él
        if (grupoActual !== '' && pub.grupo !== grupoActual) {
            return false;
        }

        // Sin palabras escritas, alcanza con pasar el filtro de grupo
        if (palabras.length === 0) {
            return true;
        }

        const texto = normalizar(
            [pub.grupo, pub.capitulo, pub.titulo, pub.subtitulo].join(' ')
        );
        // La publicación debe contener TODAS las palabras escritas
        return palabras.every(function (palabra) {
            return texto.includes(palabra);
        });
    });

    mostrarPagina(1);
}

// ---------------------------------------------- 
// PANEL LATERAL: abrir y cerrar
// ---------------------------------------------- 
function panelAbierto() {
    return filtroPanel.classList.contains('abierto');
}

function abrirPanel() {
    filtroPanel.classList.add('abierto');
    filtroFondo.classList.add('abierto');
    btnMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';   // la página de atrás no se mueve
    filtroCerrar.focus();
}

function cerrarPanel() {
    filtroPanel.classList.remove('abierto');
    filtroFondo.classList.remove('abierto');
    btnMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    btnMenu.focus();
}

// Crea un botón del panel (por ejemplo "Todos" o "Nehemías")
function crearOpcionMenu(texto, valor) {
    const opcion = document.createElement('button');
    opcion.type = 'button';
    opcion.className = 'opcion_menu';
    opcion.textContent = texto;

    if (valor === grupoActual) {
        opcion.classList.add('activa');
        opcion.setAttribute('aria-pressed', 'true');
    }

    opcion.addEventListener('click', function () {
        grupoActual = valor;
        dibujarMenu();
        cerrarPanel();
        filtrar();
    });

    listaGrupos.appendChild(opcion);
}

// Arma las opciones del panel a partir de los grupos que existen en la lista
function dibujarMenu() {
    listaGrupos.replaceChildren();

    // Grupos sin repetir, en el orden en que aparecen
    const grupos = [];
    publicaciones.forEach(function (pub) {
        if (!grupos.includes(pub.grupo)) {
            grupos.push(pub.grupo);
        }
    });

    crearOpcionMenu('Todos', '');
    grupos.forEach(function (grupo) {
        crearOpcionMenu(grupo, grupo);
    });
}

// Arma una tarjeta a partir de una publicación de la lista
function crearTarjeta(pub) {
    const tarjeta = document.createElement('a');
    tarjeta.className = 'card';
    tarjeta.href = pub.enlace;

    const imagen = document.createElement('div');
    imagen.className = 'card_imagen';
    imagen.textContent = 'Imagen';

    const capitulo = document.createElement('div');
    capitulo.className = 'card_capitulo';
    capitulo.textContent = pub.capitulo;

    const titulo = document.createElement('div');
    titulo.className = 'card_titulo';

    const negrita = document.createElement('strong');
    negrita.textContent = pub.titulo;
    titulo.appendChild(negrita);

    if (pub.subtitulo) {
        titulo.appendChild(document.createElement('br'));
        titulo.appendChild(document.createTextNode(pub.subtitulo));
    }

    tarjeta.append(imagen, capitulo, titulo);
    return tarjeta;
}

// Dibuja los botones numerados (1, 2, 3...) y marca el de la página actual
function dibujarNumeros() {
    zonaNumeros.replaceChildren();

    for (let i = 1; i <= totalPaginas(); i++) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'pag_numero';
        boton.textContent = i;

        if (i === paginaActual) {
            boton.classList.add('activa');
            boton.setAttribute('aria-current', 'page');
        }

        boton.addEventListener('click', function () {
            irAPagina(i);
        });

        zonaNumeros.appendChild(boton);
    }
}

// Muestra las tarjetas de una página (la 1 es la primera)
function mostrarPagina(numero) {
    paginaActual = numero;
    contenedor.replaceChildren();

    if (listaActual.length === 0) {
        // Si la búsqueda no encontró nada, avisamos
        const aviso = document.createElement('p');
        aviso.className = 'sin_resultados';
        aviso.textContent = 'No encontramos publicaciones con esa búsqueda.';
        contenedor.appendChild(aviso);
    } else {
        const desde = (numero - 1) * POR_PAGINA;
        const hasta = desde + POR_PAGINA;

        listaActual.slice(desde, hasta).forEach(function (pub) {
            contenedor.appendChild(crearTarjeta(pub));
        });
    }

    dibujarNumeros();

    // Atrás se apaga en la primera página, Siguiente en la última
    btnAtras.disabled = (paginaActual <= 1);
    btnSiguiente.disabled = (paginaActual >= totalPaginas());
}

// Cambia de página y vuelve al principio de la pantalla
function irAPagina(numero) {
    mostrarPagina(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnAtras.addEventListener('click', function () {
    if (paginaActual > 1) {
        irAPagina(paginaActual - 1);
    }
});

btnSiguiente.addEventListener('click', function () {
    if (paginaActual < totalPaginas()) {
        irAPagina(paginaActual + 1);
    }
});

// El buscador filtra mientras se escribe, y también al tocar la lupa
campoBusqueda.addEventListener('input', filtrar);
btnBuscar.addEventListener('click', filtrar);

// El embudo abre el panel; la X, el fondo oscuro y la tecla Esc lo cierran
btnMenu.addEventListener('click', abrirPanel);
filtroCerrar.addEventListener('click', cerrarPanel);
filtroFondo.addEventListener('click', cerrarPanel);

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && panelAbierto()) {
        cerrarPanel();
    }
});

// Al cargar la página: armamos el panel y mostramos la primera página
dibujarMenu();
mostrarPagina(1);