var typeItem;
var idItem;
var datosItem;
var idUsuarioLoggeado;
var nuevaValoracionDada;
var estaEnListaDeSeguimiento = false;

function obtenerDatosItem() {
    fetch(URL_BASE + "/" + typeItem + '/' + idItem + "?" + API_KEY_TMDB + '&language=es', {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener los datos de este item');
    }).then(data => {
        datosItem = data;
        isEnListaDeSeguimiento();
        rellenarContainerPrincipal();
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido recuperar los datos del item',
            icon: 'error',
        }).then(() => {
            window.location.href = URLBASE_POSTMOVIE;
        });
    });
}

function isEnListaDeSeguimiento() {
    fetch(URLBASE_POSTMOVIE+"items/obtenerItemDeListaSeg?idItem=" + idItem + "&idUsuario=" + idUsuarioLoggeado, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('Error al acceder a la lista de seguimiento');
    }).then(function (item) {
        if (!item) {
            //No existe en la lista de seguimiento
            estaEnListaDeSeguimiento = false;
        } else {
            //Existe en la lista de seguimiento
            estaEnListaDeSeguimiento = true;
            //Se establece el icono indicando que el elemento esta en la lista de seguimiento
            const divIconoAñadirListaSeg = document.querySelector("#divIconoAñadirListaSeg");
            divIconoAñadirListaSeg.innerHTML = "";
            divIconoAñadirListaSeg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
            `
            $("#divIconoAñadirListaSeg").attr("id", "divIconoAñadidoListaSeg");
        }

    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido acceder a la lista de seguimiento',
            icon: 'error',
        }).then(() => {

        });
    });
}

function rellenarContainerPrincipal() {
    //Columna Izquierda
    const divCard = document.querySelector('.cardMostrarItem');
    divCard.innerHTML = `
    <img src="${URL_BASE_IMG_W500 + datosItem.poster_path}" alt="${datosItem.title}">`
    //Columna Derecha
    if (datosItem?.title) { //Se trata de una pelicula
        rellenarValoracionesPelicula();
        obtenerMediaPelicula();
        document.getElementById("tituloItem").innerHTML = datosItem.title;
        document.getElementById("tipoItem").innerHTML = "Pelicula &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + "<span class='fechaLanzamiento'>(" + datosItem.release_date + ")</span>";
        document.getElementById("tagline").innerHTML = datosItem.tagline;
        document.getElementById("textoResumen").innerHTML = datosItem.overview;
        let divGeneros = document.getElementById("generos");
        let generos = datosItem.genres;
        for (g of generos) {
            const generoElement = document.createElement('div');
            generoElement.classList.add('generoItem');
            generoElement.innerText = g.name;
            divGeneros.appendChild(generoElement);
        }
    } else { //Se trata de una serie
        rellenarValoracionesSerie();
        obtenerMediaSerie();
        document.getElementById("tituloItem").innerHTML = datosItem.name;
        document.getElementById("tipoItem").innerHTML = "Serie &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + "<span class='fechaLanzamiento'>(" + datosItem.first_air_date + ")";
        document.getElementById("tagline").innerHTML = datosItem.tagline;
        document.getElementById("textoResumen").innerHTML = datosItem.overview;
        let divGeneros = document.getElementById("generos");
        let generos = datosItem.genres;
        for (g of generos) {
            const generoElement = document.createElement('div');
            generoElement.classList.add('generoItem');
            generoElement.innerText = g.name;
            divGeneros.appendChild(generoElement);
        }
    }
}

function obtenerMediaPelicula() {
    fetch(URLBASE_POSTMOVIE+"peliculas/obtenerMediaPelicula?idPelicula=" + idItem, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido recuperar la media de las valoraciones para esta pelicula');
    }).then(function (media) {

        var media = Object.values(media);
        if (media[0] != null) {
            //Existe al menos una valoracion para esta pelicula
            const puntuacionMedia = document.querySelector('.puntuacionMedia');
            puntuacionMedia.innerText = parseFloat(Object.values(media)).toFixed(1);
        } else {
            //No existe ninguna valoracion para esta pelicula
            const puntuacionMedia = document.querySelector('.puntuacionMedia');
            puntuacionMedia.innerText = "-";
        }

    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido obtener la media de las valoraciones para esta pelicula',
            icon: 'error',
        }).then(() => {

        });
    });
}

function obtenerMediaSerie() {
    fetch(URLBASE_POSTMOVIE+"series/obtenerMediaSerie?idSerie=" + idItem, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido recuperar la media de las valoraciones para esta serie');
    }).then(function (media) {

        var media = Object.values(media);
        if (media[0] != null) {
            //Existe al menos una valoracion para esta serie
            const puntuacionMedia = document.querySelector('.puntuacionMedia');
            puntuacionMedia.innerText = parseFloat(Object.values(media)).toFixed(1);
        } else {
            //No existe ninguna valoracion para esta serie
            const puntuacionMedia = document.querySelector('.puntuacionMedia');
            puntuacionMedia.innerText = "-";
        }

    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se ha podido obtener la media de las valoraciones para esta serie',
            icon: 'error',
        }).then(() => {

        });
    });
}


function rellenarValoracionesPelicula() {
    //Se hace diferenciacion dependiendo de si ha votado o no
    fetch(URLBASE_POSTMOVIE+"peliculas/obtenerValoracionPelicula?idPelicula=" + idItem + "&idUsuario=" + idUsuarioLoggeado, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido recuperar la valoracion de la pelicula');
    }).then(function (valoracion) {
        //Existía valoracion de ese usuario para dicha pelicula
        valoracion = JSON.stringify(valoracion);
        valoracion = JSON.parse(valoracion);
        const tuPuntuacion = document.querySelector('.tuPuntuacion');
        tuPuntuacion.innerText = valoracion.calificacion;
        //Evento para el boton editar valoracion (lapiz)
        $("#editarPuntuacion").attr("data-bs-toggle", "modal");
        $("#editarPuntuacion").attr("data-bs-target", "#modalValorarPelicula");
    }).catch(function (error) {
        //No existe valoracion de ese usuario para dicha pelicula

        //Se elimina el icono(lapiz) de editar puntuacion
        $("#editarPuntuacion").remove();
        //Se establece el boton de 'Valorar'
        const tuPuntuacion = document.querySelector('.estrellaTuPuntuacion');
        $('.estrellaTuPuntuacion').removeClass("fa-star");
        $('.estrellaTuPuntuacion').removeClass("fa");
        tuPuntuacion.innerHTML = `
        <button type="button" class="btn btn-primary mt-2 btnEmitirValoracionPelicula" id="btn-registrar">Valorar</button>
       `;

        //Evento de click sobre el boton valorar (aparece en caso de que el usuario no haya valorado ya dicha pelicula)
        $(".btnEmitirValoracionPelicula").attr("data-bs-toggle", "modal");
        $(".btnEmitirValoracionPelicula").attr("data-bs-target", "#modalValorarPelicula");

    });

}

function rellenarValoracionesSerie() {
    //Se hace diferenciacion dependiendo de si ha votado o no
    fetch(URLBASE_POSTMOVIE+"series/obtenerValoracionSerie?idSerie=" + idItem + "&idUsuario=" + idUsuarioLoggeado, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se ha podido recuperar la valoracion de la serie');
    }).then(function (valoracion) {
        //Existía valoracion de ese usuario para dicha serie
        valoracion = JSON.stringify(valoracion);
        valoracion = JSON.parse(valoracion);
        const tuPuntuacion = document.querySelector('.tuPuntuacion');
        tuPuntuacion.innerText = valoracion.calificacion;
        //Evento para el boton editar valoracion
        $("#editarPuntuacion").attr("data-bs-toggle", "modal");
        $("#editarPuntuacion").attr("data-bs-target", "#modalValorarSerie");
    }).catch(function (error) {
        //No existe valoracion de ese usuario para dicha serie

        //Se elimina el icono(lapiz) de editar puntuacion
        $("#editarPuntuacion").remove();
        //Se establece el boton de 'Valorar'
        const tuPuntuacion = document.querySelector('.estrellaTuPuntuacion');
        $('.estrellaTuPuntuacion').removeClass("fa-star");
        $('.estrellaTuPuntuacion').removeClass("fa");
        tuPuntuacion.innerHTML = `
        <button type="button" class="btn btn-primary mt-2 btnEmitirValoracionSerie" id="btn-registrar">Valorar</button>
       `;

        //Evento de click sobre el boton valorar (aparece en caso de que el usuario no haya valorado ya dicha serie)
        $(".btnEmitirValoracionSerie").attr("data-bs-toggle", "modal");
        $(".btnEmitirValoracionSerie").attr("data-bs-target", "#modalValorarSerie");
    });
}

function marcarEstrellaPelicula(item) {
    var nombre;

    if (item.id[1] == 0) {
        nuevaValoracionDada = 10;
        nombre = item.id.substring(2); //Se coge del id, todo menos el primer y segundo caracter
    } else {
        nuevaValoracionDada = item.id[0]; //Se coge del id de la estrella que sera: Xestrella, coger solo el primer digito, es decir, el numero. p.e: 5estrella --> obtengo el 5        
        nombre = item.id.substring(1); //Se coge del id, todo menos el primer caracter
    }

    for (let i = 0; i < 10; i++) {

        if (i < nuevaValoracionDada) {
            //primera vez que entra --> 0+1 = 1estrella. Entonces le digo que me pinte ese id
            document.getElementById((i + 1) + nombre).style.color = "#9749aa";

            const valoracionDada = document.querySelector("#puntuacionMarcadaPelicula");
            valoracionDada.innerText = nuevaValoracionDada;
        } else {
            document.getElementById((i + 1) + nombre).style.color = "black";
        }
    }

    const btnConfirmarValoracion = document.querySelector("#btn-confirmarValoracionPelicula");
    btnConfirmarValoracion.addEventListener('click', guardarValoracionPeliculaBD);
}

function guardarValoracionPeliculaBD() {
    const btnEditarValoracion = document.querySelector("#editarPuntuacion");
    if (btnEditarValoracion === null) { //Se trata de la primera valoracion
        var datos = {
            "idUsuario": idUsuarioLoggeado,
            "idPelicula": idItem,
            "valoracionEmitida": nuevaValoracionDada,
            "title": datosItem.title,
            "poster": datosItem.poster_path
        };
        fetch(URLBASE_POSTMOVIE+"peliculas/agregarValoracionPelicula", {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(datos),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {
            if (response.ok) {
                return response;
            } else throw new Error('No se ha podido añadir la valoración');
        }).then(data => {
            swal({
                title: '¡Bien!',
                text: 'Has valorado esta pelicula',
                icon: 'success',
            }).then(() => {
                location.reload();
            });
        }).catch(function (error) {
            console.log(error)
            swal({
                title: 'Algo ha ido mal...',
                text: 'Tu valoración no ha podido ser registrada',
                icon: 'error',
            }).then(() => {
                location.reload();
            });
        });

    } else { //Se trata de una actualizacion de la valoracion anterior
        fetch(URLBASE_POSTMOVIE+"peliculas/actualizarValoracionPelicula", {
            method: 'PUT',
            redirect: 'follow',
            body: JSON.stringify({
                "idUsuario": idUsuarioLoggeado,
                "idPelicula": idItem,
                "valoracionEmitida": nuevaValoracionDada
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {
            if (response.ok) {
                swal({
                    title: '¡Bien!',
                    text: 'La valoración ha sido actualizada',
                    icon: 'success',
                }).then(() => {
                    location.reload();
                });
            }

        }).catch(function (error) {
            swal({
                title: 'Vaya...',
                text: 'Ha ocurrido un error al actualizar la valoración',
                icon: 'error',
            }).then(() => {
                location.reload();
            });
        })
    }


}

function marcarEstrellaSerie(item) {
    var nombre;
    
    if (item.id[1] == 0) {
        nuevaValoracionDada = 10;
        nombre = item.id.substring(2); //Se coge del id, todo menos el primer y segundo caracter
    } else {
        nuevaValoracionDada = item.id[0]; //Se coge del id de la estrella que sera: XEstrella, coger solo el primer digito, es decir, el numero. p.e: 5Estrella --> se obtiene el 5        
        nombre = item.id.substring(1); //Se coge del id, todo menos el primer caracter
    }

    for (let i = 0; i < 10; i++) {

        if (i < nuevaValoracionDada) {
            //primera vez que entra --> 0+1 = 1estrella. Entonces se le indica que pinte ese id
            document.getElementById((i + 1) + nombre).style.color = "#9749aa";

            const valoracionDada = document.querySelector("#puntuacionMarcadaSerie");
            valoracionDada.innerText = nuevaValoracionDada;
        } else {
            document.getElementById((i + 1) + nombre).style.color = "black";
        }
    }

    const btnConfirmarValoracion = document.querySelector("#btn-confirmarValoracionSerie");
    btnConfirmarValoracion.addEventListener('click', guardarValoracionSerieBD);
}

function guardarValoracionSerieBD() {
    const btnEditarValoracion = document.querySelector("#editarPuntuacion");
    if (btnEditarValoracion === null) { //Se trata de la primera valoracion
        var datos = {
            "idUsuario": idUsuarioLoggeado,
            "idSerie": idItem,
            "valoracionEmitida": nuevaValoracionDada,
            "titulo": datosItem.name,
            "poster": datosItem.poster_path
        };
        fetch(URLBASE_POSTMOVIE+"series/agregarValoracionSerie", {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(datos),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {
            if (response.ok) {
                return response;
            } else throw new Error('No se ha podido añadir la valoración');
        }).then(data => {
            swal({
                title: '¡Bien!',
                text: 'Has valorado esta serie',
                icon: 'success',
            }).then(() => {
                location.reload();
            });
        }).catch(function (error) {
            swal({
                title: 'Algo ha ido mal...',
                text: 'Tu valoración no ha podido ser registrada',
                icon: 'error',
            }).then(() => {
                location.reload();
            });
        });

    } else { //Se trata de una actualizacion de la valoracion anterior
        fetch(URLBASE_POSTMOVIE+"series/actualizarValoracionSerie", {
            method: 'PUT',
            redirect: 'follow',
            body: JSON.stringify({
                "idUsuario": idUsuarioLoggeado,
                "idSerie": idItem,
                "valoracionEmitida": nuevaValoracionDada
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {
            if (response.ok) {
                swal({
                    title: '¡Bien!',
                    text: 'La valoración ha sido actualizada',
                    icon: 'success',
                }).then(() => {
                    location.reload();
                });

            }

        }).catch(function (error) {
            swal({
                title: 'Vaya...',
                text: 'Ha ocurrido un error al actualizar la valoración',
                icon: 'error',
            }).then(() => {
                location.reload();
            });
        })
    }
}


function obtenerItemsSimilares() {
    fetch(URL_BASE + "/" + typeItem + '/' + idItem + '/similar' + "?"+ API_KEY_TMDB + '&language=es', {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener los items similares');
    }).then(data => {
        cargarSubcarouselItemsSimilares(data.results);
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido recuperar los items similares',
            icon: 'error',
        }).then(() => {
            
        });
    });

}

function cargarSubcarouselItemsSimilares(itemsObtenidos) {

    let container = document.querySelector('.swiper-wrapper');

    for (item of itemsObtenidos) {
        if (item?.poster_path) {
            const { poster_path, id } = item;
            const peliElement = document.createElement('div');
            peliElement.classList.add('swiper-slide');
            peliElement.innerHTML = `
            <img src="${URL_BASE_IMG_W500 + poster_path}" alt="${id}"> 
            `
            peliElement.addEventListener('click', itemPulsado);
            container.appendChild(peliElement);
        } else {
            continue;
        }
    }
}

function itemPulsado(e) {
    let idPelicula = e.currentTarget.firstElementChild.alt;
    window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + idPelicula + "&type=" + typeItem;
}

function obtenerImagenes() {
    fetch(URL_BASE + "/"+  typeItem + '/' + idItem + '/images' + "?" + API_KEY_TMDB + '&language=en-US&include_image_language=en%2Cnull', {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(function (response) {
        if (response.ok)
            return response.json();
        else throw new Error('No se han podido obtener las imágenes del item');
    }).then(data => {
        mostrarImagenes(data.backdrops);
    }).catch(function (error) {
        swal({
            title: 'Error',
            text: 'No se han podido recuperar las imágenes del item',
            icon: 'error',
        }).then(() => {
            
        });
    });
}

function mostrarImagenes(imagenesAMostrar) {
    if (imagenesAMostrar.length > 1) {
        //Imagen lado izquierdo
        const colIzq = document.querySelector('.columnaImgItemIzq');
        colIzq.innerHTML = `
        <img src="${URL_BASE_IMG_ORIG + imagenesAMostrar[Math.floor(Math.random() * imagenesAMostrar.length)].file_path}" alt="imagen" class="imgItem">
        `
        //Imagen lado derecho
        const colDer = document.querySelector('.columnaImgItemDer');
        colDer.innerHTML = `
        <img src="${URL_BASE_IMG_ORIG + imagenesAMostrar[Math.floor(Math.random() * imagenesAMostrar.length)].file_path}" alt="imagen" class="imgItem">
        `
    }
}

//Funcion para obtener la cookie que contiene al token jwt
function obtenerToken() {
    const cookies = document.cookie.split(';');
    const patronCookieDaweb = /jwt/;
    for (cookie of cookies) {
        if (patronCookieDaweb.test(cookie)) {
            const valorToken = cookie.split('=');
            token = valorToken[1];
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
    idUsuarioLoggeado = tokenOut.id;
};

function agregarALaListaDeSeguimiento() {

    var title;
    var tipoItem; //Usado para mostrar el mensaje concreto una vez añadido el item a la lista de seguimiento
    if (typeItem == "tv") {
        title = datosItem.name;
        tipoItem = "Serie";
    } else {
        title = datosItem.title;
        tipoItem = "Pelicula";
    }

    const iconoAñadido = document.querySelector("#divIconoAñadidoListaSeg");

    if (estaEnListaDeSeguimiento || iconoAñadido) {
        return;
    }

    var datos = {
        "idUsuario": idUsuarioLoggeado,
        "idItem": idItem,
        "tipoItem": typeItem,
        "title": title,
        "poster": datosItem.poster_path
    };

    fetch(URLBASE_POSTMOVIE+"items/agregarAListaSeguimiento", {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(datos),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then().then(response => {
        if (response.ok) {
            const divIconoAñadirListaSeg = document.querySelector("#divIconoAñadirListaSeg");
            divIconoAñadirListaSeg.innerHTML = "";
            divIconoAñadirListaSeg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
            `
            isEnListaDeSeguimiento = true;

            swal({
                title: 'Listo',
                text: tipoItem + ' añadida a la lista de seguimiento',
                icon: 'success',
            }).then(() => {
                agregarALaListaDeSeguimiento(); //Asi se evita recargar toda la pagina y solo se cambia el icono 
            });

            $("#divIconoAñadirListaSeg").attr("id", "divIconoAñadidoListaSeg");

        } else {
            swal({
                title: 'Oops...',
                text: 'Error al añadir el item a la lista de seguimiento',
                icon: 'error',
            }).then(() => {
                location.reload();
            });
        }
    });

}

window.onload = function () {
    //Se recuperan los atributos de la url
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    idItem = urlParams.get('idItem');
    typeItem = urlParams.get('type');

    obtenerToken();
    obtenerDatosItem();
    obtenerImagenes();
    obtenerItemsSimilares();

    const btnAñadirListaSeguimiento = document.querySelector("#divIconoAñadirListaSeg");
    btnAñadirListaSeguimiento.addEventListener("click", agregarALaListaDeSeguimiento);

}