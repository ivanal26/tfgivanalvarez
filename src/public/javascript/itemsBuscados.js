const palabra = document.currentScript.getAttribute('palabra');

function obtenerItemsPorPalabra() {
    fetch(URL_BUSCARITEMS_POR_PALABRA + palabra, {
        method: 'GET',
        redirect: 'follow',
        headers: new Headers({
            Accept: 'application/json'
        })
    }).then(res => res.json()).then(data => {
        itemsObtenidos = data.results;
        mostrarTarjetas(itemsObtenidos);
    });
}


function mostrarTarjetas(itemsAMostrar) {

    if (itemsAMostrar === undefined || Object.keys(itemsAMostrar).length == 0) {
        var container = document.querySelector('#flexItemsBuscados');
        container.innerHTML = `
                <div class="container w-75 my-5 rounded shadow containerNoItemEncontrado">
            <div class="row rowNoItemEncontrado rounded">
                <div class="col colImgNoItemEncontrado  col-12 col-sm-12 col-md-4 col-lg-4 col-xl-5 col-xxl-6">
                    <div>
                        <img src="../../images/oops.png" alt="" id="imagenOops">
                    </div>
                </div>
                <div class="col colTextoNoItemEncontrado">
                    <h1 id="tituloNoItemEncontrado" class="text-center textoNoItemEncontrado">¡OOPS!</h1>
                    <h2 id="subheaderNoItemEncontrado" class="text-center textoNoItemEncontrado"><strong>No se han
                                encontrado resultados</strong> </h2>
                        <h6 id="subheader2NoItemEncontrado" class="text-center textoNoItemEncontrado">Intenta usar otra
                            palabra clave</h6>
                    </div>
                </div>
            </div>
                `
    } else {

        var container = document.querySelector('#flexItemsBuscados');
        for (let i = 0; i < 20; i++) {
            //Para resolver el error "Cannot read properties of undefined" (si no es nula o undefined la propiedad, entra al if)
            if (itemsAMostrar[i]?.poster_path) {
                //Si es una serie tendra name como titulo, si es una pelicula tendra title
                var tituloItem;
                if (itemsAMostrar[i]?.title) {
                    tituloItem = itemsAMostrar[i].title;
                } else {
                    tituloItem = itemsAMostrar[i].name;
                }

                const item = document.createElement('div');
                item.classList.add('itemBase');
                item.innerHTML = `
                    <img src="${URL_BASE_IMG_W500 + itemsAMostrar[i].poster_path}" id="${itemsAMostrar[i].id}" alt="${itemsAMostrar[i].media_type}">                
                    `
                item.addEventListener('click', asignarEventoClick);
                container.appendChild(item);
            }
        }
    }
}

function asignarEventoClick(e) {
    tipoItem = e.currentTarget.firstElementChild.alt;
    idItem = e.currentTarget.firstElementChild.id;
    window.location.href = URLBASE_POSTMOVIE+"items/vistas/itemSeleccionado?idItem=" + idItem + "&type=" + tipoItem;
}

window.onload = function() {
    obtenerItemsPorPalabra();
}