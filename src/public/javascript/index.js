var peliculasObtenidas = [];
var seriesObtenidas = [];

//Funcion para obtener las series y peliculas famosas del momento
function obtenerItemsMasFamosos() {
    //Peliculas
    fetch(URL_MOSTPOPULAR_PELICULAS, { //Al recuperar directamente de TMDB API, siempre estarán actualizadas las tarjetas con las mas famosas de ese momento
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener las peliculas populares');
    }).then(data => {
        peliculasObtenidas = data.results;
        //Series
        fetch(URL_MOSTPOPULAR_SERIES, {
            method: 'GET',
            redirect: 'follow',
            headers: new Headers({
                Accept: 'application/json'
            })
        }).then(function (response) {
            if (response.ok)
                return response.json();
            else throw new Error('No se han podido obtener las series populares');
        }).then(data => {
            seriesObtenidas = data.results;
            cargarCarouselPrincipal();
        }).catch(function (error) {
            swal({
                title: 'Error',
                text: 'No se han podido recuperar las series populares',
                icon: 'error',
            }).then(() => {
                
            });
        })
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido recuperar las peliculas populares',
            icon: 'error',
        }).then(() => {
            
        });
    });
}

function cargarCarouselPrincipal() {
    //Se cargan las imagenes de fondo
    const pelicula1Carousel = document.querySelector('#pelicula1Carousel');
    pelicula1Carousel.setAttribute("src", `${URL_BASE_IMG_ORIG + peliculasObtenidas[0].backdrop_path}`);
    const pelicula2Carousel = document.querySelector('#pelicula2Carousel');
    pelicula2Carousel.setAttribute("src", `${URL_BASE_IMG_ORIG + peliculasObtenidas[1].backdrop_path}`);

    const serie1Carousel = document.querySelector('#serie1Carousel');
    serie1Carousel.setAttribute("src", `${URL_BASE_IMG_ORIG + seriesObtenidas[0].backdrop_path}`);
    const serie2Carousel = document.querySelector('#serie2Carousel');
    serie2Carousel.setAttribute("src", `${URL_BASE_IMG_ORIG + seriesObtenidas[1].backdrop_path}`);

    //Se carga el contenido de cada carousel-item
    //Pelicula 1 
    const tituloPelicula1Carousel = peliculasObtenidas[0].title;
    $('#tituloPelicula1Carousel').text(tituloPelicula1Carousel);
    //Pelicula 2
    const tituloPelicula2Carousel = peliculasObtenidas[1].title;
    $('#tituloPelicula2Carousel').text(tituloPelicula2Carousel);
    //Serie 1
    const tituloSerie1Carousel = seriesObtenidas[0].name;
    $('#tituloSerie1Carousel').text(tituloSerie1Carousel);
    //Serie 2
    const tituloSerie2Carousel = seriesObtenidas[1].name;
    $('#tituloSerie2Carousel').text(tituloSerie2Carousel);

    //Se asigna el evento de click a cada botón del carousel
    const idPelicula1 = peliculasObtenidas[0].id;
    const btnVerAhoraPeli1 = document.querySelector('#botonPelicula1');
    btnVerAhoraPeli1.addEventListener('click', () => {
        window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idPelicula1 + "&type=movie";
    });

    const idPelicula2 = peliculasObtenidas[1].id;
    const btnVerAhoraPeli2 = document.querySelector('#botonPelicula2');
    btnVerAhoraPeli2.addEventListener('click', () => {
        window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idPelicula2 + "&type=movie";
    });

    const idSerie1 = seriesObtenidas[0].id;
    const btnVerAhoraSerie1 = document.querySelector('#botonSerie1');
    btnVerAhoraSerie1.addEventListener('click', () => {
        window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idSerie1 + "&type=tv";
    });

    const idSerie2 = seriesObtenidas[1].id;
    const btnVerAhoraSerie2 = document.querySelector('#botonSerie2');
    btnVerAhoraSerie2.addEventListener('click', () => {
        window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idSerie2 + "&type=tv";
    });

    //Se eliminan los dos primeros elementos de cada array ya que son usados en el carousel
    peliculasObtenidas.splice(0, 2);
    seriesObtenidas.splice(0, 2);

    cargarSubcarouselPeliculas();
    mostrarSeriesDelMomento();
}

function cargarSubcarouselPeliculas() {
    let container = document.querySelector('.swiper-wrapper');
    peliculasObtenidas.forEach(pelicula => {
        const { poster_path, id } = pelicula;
        const peliElement = document.createElement('div');
        peliElement.classList.add('swiper-slide');
        peliElement.innerHTML = `
        <img src="${URL_BASE_IMG_ORIG + poster_path}" alt="${id}"> 
        `
        container.appendChild(peliElement);
    })

    //Se establece el evento de click sobre cada pelicula
    let peliculasSwiper = document.querySelectorAll('.swiper-slide');
    for (p of peliculasSwiper) {
        p.addEventListener('click', peliPulsada);
    }
}

function mostrarSeriesDelMomento() {
    let container = document.querySelector('#container-TopSeries');
    var arrayTop6Series = seriesObtenidas.slice(0, 6);
    //De las series restantes, solo se muestra el top 6 series del momento
    arrayTop6Series.forEach(serie => {
        const { poster_path, id } = serie;
        const serieElement = document.createElement('div');
        serieElement.classList.add('cardMejoresSeriesIndex');
        serieElement.innerHTML = `
        <img src="${URL_BASE_IMG_ORIG + poster_path}" alt="${id}">
        `
        container.appendChild(serieElement);

        //Se establece el evento de click sobre cada serie
        let seriesTop = document.querySelectorAll('.cardMejoresSeriesIndex');
        for (s of seriesTop) {
            s.addEventListener('click', seriePulsada);
        }
    });
}

function peliPulsada(e) {
    let idPelicula = e.currentTarget.firstElementChild.alt;
    window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idPelicula + "&type=movie";
}

function seriePulsada(e) {
    let idSerie = e.currentTarget.firstElementChild.alt;
    window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idSerie + "&type=tv";
}

window.onload = function () {
    obtenerItemsMasFamosos();
}