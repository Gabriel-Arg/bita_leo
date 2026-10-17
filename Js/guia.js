// Busca todos los subtítulos de la publicación
const subtitulos = document.querySelectorAll('.parrafo_p_subtitulo');

console.log('Subtítulos encontrados:', subtitulos.length);

subtitulos.forEach(function (subtitulo) {
    console.log(subtitulo.textContent.trim());
});