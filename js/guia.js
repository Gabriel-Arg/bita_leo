// Busca los subtítulos de la publicación
const subtitulos = document.querySelectorAll('.parrafo_p_subtitulo');

// Crea la guía: un contenedor con una línea y su relleno
const guia = document.createElement('nav');
guia.className = 'guia';
guia.setAttribute('aria-label', 'Guía de la publicación');

const linea = document.createElement('div');
linea.className = 'guia_linea';

const progreso = document.createElement('div');
progreso.className = 'guia_progreso';

linea.appendChild(progreso);
guia.appendChild(linea);

// Crea una marca (botón) por cada subtítulo
const marcas = [];

subtitulos.forEach(function (subtitulo) {
    const marca = document.createElement('button');
    marca.className = 'guia_marca';
    marca.type = 'button';
    marca.title = subtitulo.textContent.trim();
    marca.setAttribute('aria-label', subtitulo.textContent.trim());

    // Al tocar la marca, la página se desplaza hasta ese subtítulo
    marca.addEventListener('click', function () {
        subtitulo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    guia.appendChild(marca);
    marcas.push({ subtitulo: subtitulo, marca: marca, fraccion: 0 });
});

document.body.appendChild(guia);

// Cuánto se puede desplazar la página en total
function maximoScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
}

// Coloca cada marca según dónde está su subtítulo en la página
function posicionarMarcas() {
    const max = maximoScroll();
    marcas.forEach(function (item) {
        const y = item.subtitulo.getBoundingClientRect().top + window.scrollY;
        item.fraccion = Math.min(Math.max(y / max, 0), 1);
        item.marca.style.top = (item.fraccion * 100) + '%';
    });
    actualizar();
}

// Llena la línea y resalta la marca de la parte que estás leyendo
function actualizar() {
    const max = maximoScroll();
    const fraccion = max > 0 ? window.scrollY / max : 0;
    progreso.style.height = (fraccion * 100) + '%';

    let activa = null;
    marcas.forEach(function (item) {
        item.marca.classList.remove('activa');
        if (item.fraccion <= fraccion + 0.001) {
            activa = item;
        }
    });
    if (activa) {
        activa.marca.classList.add('activa');
    }
}

window.addEventListener('scroll', actualizar);
window.addEventListener('resize', posicionarMarcas);
window.addEventListener('load', posicionarMarcas);
posicionarMarcas();