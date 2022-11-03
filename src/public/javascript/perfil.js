var tokenObtenido; //Contiene el id del usuario logeado (contenido en token)
var usuarioDeSesion; //Contiene todos los datos del usuario logeado

//Funcion que asigna evento de click a los avatares contenidos en el modal
function eventoClickParaCadaAvatar() {
    const containerAvatares = document.querySelectorAll('.modal-body');
    listaAvatares = containerAvatares[0].children;
    for (avatar of listaAvatares) {
        avatar.addEventListener('click', cambiarAvatar);
    }
}

function cambiarAvatar(e) {
    const containerAvatares = document.querySelectorAll('.modal-body');
    listaAvatares = containerAvatares[0].children;
    for (avatar of listaAvatares) {
        avatar.setAttribute("class", "avatarNoSeleccionado")
    }
    var avatarSeleccionado = e.currentTarget.id;
    $('#' + avatarSeleccionado).removeClass('avatarNoSeleccionado');
    $('#' + avatarSeleccionado).addClass('avatarSeleccionado');

    const avatarActual = document.querySelector('.imgAvatar');
    avatarActual.setAttribute("src", "../images/" + avatarSeleccionado + ".png");

    const btnGuardarAvatar = document.querySelector(".btnGuardarAvatar");
    btnGuardarAvatar.addEventListener("click", function () {
        //Se actualiza el avatar de dicho usuario en la BD
        fetch(URLBASE_POSTMOVIE+'usuarios/actualizarAvatar', {
            method: 'PUT',
            body: JSON.stringify({
                "avatar": avatarSeleccionado + ".png",
                "idUsuario": usuarioDeSesion.id
            }),
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {
            if (response.ok)
                return response;
            else throw new Error('No se ha podido actualizar el avatar del usuario');
        }).then(function (usuario) {
            swal({
                title: 'Avatar actualizado',
                text: 'Se ha establecido un nuevo avatar',
                icon: 'success',
            }).then(() => {
                //Se cierra el modal de seleccion de avatar
                const modalAvatares = document.querySelector('#modalElegirAvatar');
                $('#modalElegirAvatar').modal('hide');
            });
        }).catch(function (error) {
            swal({
                title: 'Error',
                text: 'No se ha podido actualizar el avatar del usuario',
                icon: 'error',
            }).then(() => {
                //Se cierra el modal de seleccion de avatar
                const modalAvatares = document.querySelector('#modalElegirAvatar');
                $('#modalElegirAvatar').modal('hide');
            });
        });
    })
}

function obtenerUsuarioLogeado() {
    fetch(URLBASE_POSTMOVIE+'usuarios/obtenerUsuario?idUser=' + tokenObtenido.id, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            'Accept': 'application/json',
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido obtener el usuario logeado');
    }).then(function (usuario) {
        usuarioDeSesion = usuario;
        cargarAvatarDeUsuario();
        rellenarInfoUsuario();
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido obtener el usuario logeado',
            icon: 'error',
        }).then(() => {
            window.location.href = URLBASE_POSTMOVIE;
        });
    });
}

//Funcion que establece la imagen del avatar del usuario concreto (dicha info se obtiene de la BD) 
function cargarAvatarDeUsuario() {
    avatar = usuarioDeSesion.fotoAvatar; 
    const avatarActual = document.querySelector('.imgAvatar');
    avatarActual.setAttribute("src", "../images/" + avatar);
}

function rellenarInfoUsuario() {
    var nombreUsuario = document.querySelector(".nombreUserPerfil");
    nombreUsuario.innerHTML = usuarioDeSesion.nombreUsuario;

    var nombre = document.querySelector(".nombrePerfil");
    nombre.innerHTML = usuarioDeSesion.nombre;

    var arrayApellidos = usuarioDeSesion.apellidos.split(" "); //Se separan los apellidos en un array
    var apellidos = document.querySelector(".apellidosPerfil");
    apellidos.innerHTML = arrayApellidos[0]; //Se muestra unicamente el primer apellido

    rellenarEstadisticas();
}

function rellenarEstadisticas() {

    fetch(URLBASE_POSTMOVIE+'items/obtenerEstadisticas?idUser=' + usuarioDeSesion.id, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener las estadisticas del usuario');
    }).then(function (itemsMap) {
        var mediaPeliculas = itemsMap.mediaPeliculas[0]["AVG(`calificacion`)"];
        mediaPeliculas = parseFloat(mediaPeliculas);
        var totalPeliculasValoradas = itemsMap.totalPeliculasValoradas[0]["COUNT(*)"];

        var mediaSeries = itemsMap.mediaSeries[0]["AVG(`calificacion`)"];
        mediaSeries = parseFloat(mediaSeries);
        var totalSeriesValoradas = itemsMap.totalSeriesValoradas[0]["COUNT(*)"];

        //Primer circulo (estadisticas peliculas)
        var resultado1 = (440 - (440 * (mediaPeliculas * 10)) / 100);
        $('#circuloMarcaPeliculas').css("stroke-dashoffset", resultado1);
        var color = obtenerColorCirculo(mediaPeliculas);
        $('#circuloMarcaPeliculas').addClass(color);
        var mediaValPeliculas = document.querySelector("#mediaValoracionesPeliculas");
        mediaPeliculas = mediaPeliculas.toFixed(1);
        if (isNaN(mediaPeliculas)) {
            mediaPeliculas = 0;
        }
        mediaValPeliculas.innerHTML = `
        ${mediaPeliculas} <span class="fa fa-star estrellaPuntuacionMedia" id="estrellaPeliculas">
        `
        $('#numeroPeliculasValoradas').text(totalPeliculasValoradas);
        $('#estrellaPeliculas').addClass(color);
        //Segundo circulo (estadisticas series)
        var resultado2 = (440 - (440 * (mediaSeries * 10)) / 100);
        $('#circuloMarcaSeries').css("stroke-dashoffset", resultado2);
        color = obtenerColorCirculo(mediaSeries);
        $('#circuloMarcaSeries').addClass(color);

        var mediaValSeries = document.querySelector("#mediaValoracionesSeries");
        mediaSeries = mediaSeries.toFixed(1);
        if (isNaN(mediaSeries)) {
            mediaSeries = 0;
        }
        mediaValSeries.innerHTML = `
        ${mediaSeries} <span class="fa fa-star estrellaPuntuacionMedia" id="estrellaSeries">
        `
        $('#numeroSeriesValoradas').text(totalSeriesValoradas);
        $('#estrellaSeries').addClass(color);
        //Tercer circulo (estadisticas totales)
        var mediaPeliculas = parseFloat(mediaPeliculas);
        var mediaSeries = parseFloat(mediaSeries);
        var mediaTotal;
        if (mediaPeliculas == 0) {
            mediaTotal = mediaSeries;
        } else if (mediaSeries == 0) {
            mediaTotal = mediaPeliculas;
        } else if (mediaSeries != 0 && mediaPeliculas != 0) {
            mediaTotal = (mediaPeliculas + mediaSeries) / 2;
        }
        var resultado3 = (440 - (440 * mediaTotal * 10) / 100);
        $('#circuloMarcaTotal').css("stroke-dashoffset", resultado3);
        color = obtenerColorCirculo(mediaTotal);
        $('#circuloMarcaTotal').addClass(color);
        //Se establece tambien este valor en la primera fila de datos del usuario ('Valoracion media')
        $('#valoracionMediaDelUsuario').text(mediaTotal.toFixed(1));

        var mediaValTotal = document.querySelector("#mediaTotal");
        mediaTotal = mediaTotal.toFixed(1);
        if (isNaN(mediaTotal)) {
            mediaTotal = 0;
        }
        mediaValTotal.innerHTML = `
        ${mediaTotal} <span class="fa fa-star estrellaPuntuacionMedia" id="estrellaTotal">
        `
        $('#numeroTotalValoradas').text(totalPeliculasValoradas + totalSeriesValoradas);
        $('#estrellaTotal').addClass(color);
        //Se rellena tambien este valor en la primera fila de datos del usuario ('Items valorados')
        $('#numeroItemsValorados').text(totalPeliculasValoradas + totalSeriesValoradas);

        rellenarMejoresItemsValorados();
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido obtener las estadisticas del usuario',
            icon: 'error',
        }).then(() => {
            window.location.href = URLBASE_POSTMOVIE;
        });
    });
}

function rellenarMejoresItemsValorados() {
    fetch(URLBASE_POSTMOVIE+'items/obtenerItemsMejorValorados?idUser=' + usuarioDeSesion.id, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener los items mejor valorados');
    }).then(function (itemsMap) {
        var peliculaMejorValorada = itemsMap.peliculaTop;
        var serieMejorValorada = itemsMap.serieTop;

        //Mejor pelicula
        if (peliculaMejorValorada?.idPelicula) { //Si existe al menos una pelicula valorada

            const containerMejorPeliculaValorada = document.querySelector("#containerImgMejorPelicula");
            containerMejorPeliculaValorada.innerHTML = `
                    <h4 id="tituloPeliculaMejorVal">Pelicula mejor valorada</h4>
                    <img src="${URL_BASE_IMG_W500 + peliculaMejorValorada.poster_path}" id="${peliculaMejorValorada.idPelicula}" alt="movie">
                    <div class="capaMejorPelicula">
                        <p id='notaCapaPeliculaTop' class="notaCapaItemTop">${peliculaMejorValorada.calificacion}  <span class="fa fa-star" style="cursor: pointer;" id=""></span> </p>
                    </div>                
                    `
            containerMejorPeliculaValorada.addEventListener('click', () => {
                window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + peliculaMejorValorada.idPelicula + "&type=movie";
            });

        } else {
            const containerMejorPeliculaValorada = document.querySelector("#containerImgMejorPelicula");
            containerMejorPeliculaValorada.style.cursor = "default";
            containerMejorPeliculaValorada.innerHTML = ` 
            <h4 id="tituloPeliculaMejorVal">Pelicula mejor valorada</h4>
            <h6 id="tituloNoHayPeliMejorValorada" class="mt-5">¡Ups! Parece que no has valorado ninguna pelicula.</h6>
            <button class="btnExplorar" id="btnExplPeliculas"> Explorar
            </button>
            `
            const btnExplorarPeliculas = document.querySelector("#btnExplPeliculas");
            btnExplorarPeliculas.addEventListener("click", () => {
                window.location.href = URLBASE_POSTMOVIE+"peliculas/mostrar";
            })
        }

        if (serieMejorValorada?.idSerie) { //Si existe al menos una serie valorada
            //Mejor serie
            const containerMejorSerieValorada = document.querySelector("#containerImgMejorSerie");
            containerMejorSerieValorada.innerHTML = `
                    <h4 id="tituloSerieMejorVal">Serie mejor valorada</h4>
                    <img src="${URL_BASE_IMG_W500 + serieMejorValorada.poster_path}" id="${serieMejorValorada.idSerie}" alt="tv">
                    <div class="capaMejorSerie">
                        <p id='notaCapaSerieTop' class="notaCapaItemTop"> ${serieMejorValorada.calificacion} <span class="fa fa-star" style="cursor: pointer;" id=""></span> </p>
                    </div>                 
                    `
            containerMejorSerieValorada.addEventListener('click', () => {
                window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + serieMejorValorada.idSerie + "&type=tv";
            });
        } else {
            const containerMejorSerieValorada = document.querySelector("#containerImgMejorSerie");
            containerMejorSerieValorada.style.cursor = "default";
            containerMejorSerieValorada.innerHTML = ` 
            <h4 id="tituloSerieMejorVal">Serie mejor valorada</h4>
            <h6 id="tituloNoHaySerieMejorValorada" class="mt-5">¡Ups! Parece que no has valorado ninguna serie.</h6>
            <button class="btnExplorar" id="btnExplSeries"> Explorar
            </button>
            `

            const btnExplorarSeries = document.querySelector("#btnExplSeries");
            btnExplorarSeries.addEventListener("click", () => {
                window.location.href = URLBASE_POSTMOVIE+"series/mostrar";
            })
        }

    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido obtener los items mejor valorados',
            icon: 'error',
        }).then(() => {

        });
    })
}

function obtenerColorCirculo(valor) {
    if (valor < 5) {
        return "circuloRojo";
    } else if (valor < 7) {
        return "circuloNaranja";
    } else if (valor < 9) {
        return "circuloVerde";
    } else if (valor >= 9) {
        return "circuloMorado";
    }
}

//Funcion para obtener la cookie que contiene al token jwt
function obtenerToken() {
    const cookies = document.cookie.split(';');
    const patronCookieDaweb = /jwt/;
    for (cookie of cookies) {
        if (patronCookieDaweb.test(cookie)) {
            const valorToken = cookie.split('=');
            var token = valorToken[1];
            parsearToken(token);
            return;
        }
    }
}

//Funcion para obtener el contenido del token jwt
function parsearToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');

    var tokenOut = JSON.parse(window.atob(base64));
    tokenObtenido = tokenOut;
    obtenerUsuarioLogeado();
}

function mostrarListaValoraciones() {
    $("#containerListas").css("min-height", "100vh");
    const containerListas = document.querySelector("#containerListas");
    containerListas.innerHTML = "";

    fetch(URLBASE_POSTMOVIE+'items/obtenerListaValoraciones?idUser=' + usuarioDeSesion.id, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido obtener la lista de valoraciones');
    }).then(function (itemsMap) {

        var peliculas = itemsMap.peliculas;
        var series = itemsMap.series;
        //Boton volver atras
        var divVolverAtras = document.createElement('div');
        divVolverAtras.innerHTML = `
        <button type="button" class="btn btn-primary btnVolverAtras">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Volver
        </button>`
        containerListas.appendChild(divVolverAtras);
        btnVolverAtras = document.querySelector(".btnVolverAtras");
        btnVolverAtras.addEventListener("click", function () {
            location.reload();
        })

        //Peliculas
        var tituloPeliculasListaVal = document.createElement("h3");
        tituloPeliculasListaVal.innerHTML = "Peliculas";
        tituloPeliculasListaVal.classList.add('tituloPeliculasListaVal');
        containerListas.appendChild(tituloPeliculasListaVal);
        if (peliculas.length === 0) {

            var tituloPeliculasVacias = document.createElement("h4");
            tituloPeliculasVacias.innerHTML = "No hay valoraciones de peliculas";
            tituloPeliculasVacias.classList.add('tituloItemsVacios');
            tituloPeliculasVacias.setAttribute("id", "tituloNoPeliculaEnListaVal");
            containerListas.appendChild(tituloPeliculasVacias);

        } else {
            const divContainerPeliculas = document.createElement('div');
            divContainerPeliculas.classList.add('containerPeliculasListaVal');
            for (pelicula of peliculas) {
                const item = document.createElement('div');
                item.classList.add('itemListaVal');
                item.innerHTML = `
                        <img src="${URL_BASE_IMG_W500 + pelicula.poster_path}" id="${pelicula.idPelicula}" alt="${pelicula.titulo}" class="movie">               
                        `
                item.addEventListener('click', mostrarItemConcreto);
                divContainerPeliculas.appendChild(item);
            }
            containerListas.appendChild(divContainerPeliculas);
        }

        //Series
        var tituloSeriesListaVal = document.createElement("h3");
        tituloSeriesListaVal.innerHTML = "Series";
        tituloSeriesListaVal.classList.add('tituloSeriesListaVal');
        containerListas.appendChild(tituloSeriesListaVal);
        if (series.length === 0) {
            var tituloSeriesVacias = document.createElement("h4");
            tituloSeriesVacias.innerHTML = "No hay valoraciones de series";
            tituloSeriesVacias.classList.add('tituloItemsVacios');
            tituloSeriesVacias.setAttribute("id", "tituloNoSerieEnListaVal");
            containerListas.appendChild(tituloSeriesVacias);
        } else {
            const divContainerSeries = document.createElement('div');
            divContainerSeries.classList.add('containerSeriesListaVal');
            for (serie of series) {
                const item = document.createElement('div');
                item.classList.add('itemListaVal');
                item.innerHTML = `
                        <img src="${URL_BASE_IMG_W500 + serie.poster_path}" id="${serie.idSerie}" alt="${serie.titulo}" class="tv">               
                        `
                item.addEventListener('click', mostrarItemConcreto);
                divContainerSeries.appendChild(item);
            }
            containerListas.appendChild(divContainerSeries);
        }

    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido obtener la lista de valoraciones',
            icon: 'error',
        }).then(() => {
            location.reload();
        });
    });
}

function mostrarListaSeguimiento() {
    const containerListas = document.querySelector("#containerListas");
    containerListas.innerHTML = "";

    fetch(URLBASE_POSTMOVIE+"items/obtenerTodosListaSeg?idUsuario=" + usuarioDeSesion.id, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('Error al obtener la lista de seguimiento');
    }).then(function (items) {

        if (items.length === 0) {
            //Boton volver atras
            var divVolverAtras = document.createElement('div');
            divVolverAtras.innerHTML = `
        <button type="button" class="btn btn-primary btnVolverAtras">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Volver
        </button>`
            containerListas.appendChild(divVolverAtras);
            btnVolverAtras = document.querySelector(".btnVolverAtras");
            btnVolverAtras.addEventListener("click", function () {
                location.reload();
            })

            var tituloListaSegVacia = document.createElement("h4");
            tituloListaSegVacia.innerHTML = "No hay items en tu lista de seguimiento";
            tituloListaSegVacia.classList.add('tituloItemsVacios');
            tituloListaSegVacia.setAttribute("id", "tituloNoItemsEnListaSeg")
            containerListas.appendChild(tituloListaSegVacia);
        } else {
            //Boton volver atras
            var divVolverAtras = document.createElement('div');
            divVolverAtras.innerHTML = `
        <button type="button" class="btn btn-primary btnVolverAtras">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Volver
        </button>`
            containerListas.appendChild(divVolverAtras);
            btnVolverAtras = document.querySelector(".btnVolverAtras");
            btnVolverAtras.addEventListener("click", function () {
                location.reload();
            })
            $("#containerListas").css("min-height", "100vh");
            const divContainerItemsListaSeg = document.createElement('div');
            divContainerItemsListaSeg.classList.add('containerFlexParaListaSeg');
            for (i of items) {
                const item = document.createElement('div');
                item.classList.add('itemListaSeg');
                item.innerHTML = `
                    <img src="${URL_BASE_IMG_W500 + i.poster}" id="${i.idItem}" onclick="mostrarItemDeListaSeg(this)" alt="${i.title}" class="${i.tipoItem}">   
                    <div class="col d-grid containerBtnEliminarDeListSeg">
                        <button type="button" onclick="eliminarDeListaSeg(this)" class="btn btn-primary ${i.idItem}" id="btnEliminarDeListaSeg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>    
                        Quitar
                        </button>
                    </div>          
                    `

                divContainerItemsListaSeg.appendChild(item);
            }

            containerListas.appendChild(divContainerItemsListaSeg);
        }
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido obtener la lista de seguimiento',
            icon: 'error',
        }).then(() => {
            location.reload();
        });
    })
}

function eliminarDeListaSeg(e) {
    var idItemAQuitar = e.classList[2];
    fetch(URLBASE_POSTMOVIE+"items/eliminarDeListaSeguimiento?idItem=" + idItemAQuitar + "&idUsuario=" + usuarioDeSesion.id, {
        method: 'DELETE',
        redirect: 'follow'
    }).then(function (response) {
        if (response.ok)
            return response;
        else throw new Error('No se ha podido eliminar el item de la lista de seguimiento');
    }).then(data => {
        swal({
            title: '¡Item eliminado!',
            text: 'El item ha sido eliminado de la lista de seguimiento',
            icon: 'success',
        }).then(() => {
            mostrarListaSeguimiento();
        });
    }).catch(function (error) {
        swal({
            title: 'Algo ha ido mal...',
            text: 'El item no ha podido ser eliminado de la lista de seguimiento',
            icon: 'error',
        }).then(() => {
            location.reload();
        });
    });

}

//Funcion para mostrar item clicado de lista de seguimiento (se hace asi para que funcione correctamente el boton de borrar de lista de seguimiento)
function mostrarItemDeListaSeg(e) {
    window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + e.id + "&type=" + e.className;
}

//Funcion para mostrar item clicado de cualquier otro lugar de la pagina del perfil 
function mostrarItemConcreto(e) {
    var idItem = e.currentTarget.firstElementChild.id;
    var tipoItem = e.currentTarget.firstElementChild.className;

    window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + idItem + "&type=" + tipoItem;
}

window.onload = function () {
    obtenerToken();
    eventoClickParaCadaAvatar();

    const btnListaValoraciones = document.querySelector("#btnListaValoraciones");
    btnListaValoraciones.addEventListener("click", mostrarListaValoraciones);

    const btnListaSeguimiento = document.querySelector("#btnListaSeguimiento");
    btnListaSeguimiento.addEventListener("click", mostrarListaSeguimiento);

}