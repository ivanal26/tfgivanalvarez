var generoSeleccionado = [];
const generosSeries = [{ "id": 10759, "name": "Acción & Aventura" }, { "id": 16, "name": "Animación" }, { "id": 35, "name": "Comedia" },
{ "id": 80, "name": "Crimen" }, { "id": 99, "name": "Documental" }, { "id": 18, "name": "Drama" },
{ "id": 10751, "name": "Familia" }, { "id": 10762, "name": "Niños" }, { "id": 9648, "name": "Misterio" },
{ "id": 10763, "name": "Noticias" }, { "id": 10764, "name": "Reality" }, { "id": 10765, "name": "Fantasía & C.Ficción" },
{ "id": 10766, "name": "Soap" }, { "id": 10767, "name": "Conversaciones" }, { "id": 10768, "name": "Guerra & Política" }, { "id": 37, "name": "Western" }];

var flagFiltro = false;
var pageSinFiltro = 0;
var pageConFiltro = 1;

function recuperarSeries() {
   if (!flagFiltro) {
      pageSinFiltro++;
      fetch(URL_DISCOVER_SERIES + pageSinFiltro, {
         method: 'GET',
         redirect: 'follow',
         headers: new Headers({
            Accept: 'application/json'
         })
      }).then(function (response) {
         if (response.ok)
            return response.json();
         else throw new Error('No se han podido recuperar las series');
      }).then(data => {
         seriesObtenidas = data.results;
         mostrarTarjetas(seriesObtenidas);
      }).catch(function (error) {
         swal({
            title: 'Error',
            text: 'No se han podido recuperar las series',
            icon: 'error',
         }).then(() => {
            window.location.href = URLBASE_POSTMOVIE;
         });
      });
   } else {
      pageConFiltro++;
      fetch(URL_BUSCAR_POR_GENERO_SERIES + generoSeleccionado.join(',') + '&page=' + pageConFiltro, {
         method: 'GET',
         redirect: 'follow',
         headers: new Headers({
            Accept: 'application/json'
         })
      }).then(function (response) {
         if (response.ok)
            return response.json();
         else throw new Error('No se han podido recuperar las series aplicando el filtro indicado');
      }).then(data => {
         seriesObtenidas = data.results;
         mostrarTarjetas(seriesObtenidas);
      }).catch(function (error) {
         swal({
            title: 'Error',
            text: 'No se han podido recuperar las series aplicando el filtro indicado',
            icon: 'error',
         }).then(() => {
            location.reload();
         });
      });
   }
}

function mostrarTarjetas(seriesAMostrar) {
   var container = document.querySelector('#flex-container');
   for (let i = 0; i < 20; i++) {
      if (seriesAMostrar[i]?.poster_path) {
         const serieElement = document.createElement('div');
         serieElement.classList.add('cardTodosItems');
         serieElement.innerHTML = `
      <img src="${URL_BASE_IMG_W500 + seriesAMostrar[i].poster_path}" alt="${seriesAMostrar[i].id}">`
         container.appendChild(serieElement);
      } else {
         continue;
      }
   }

   //Se establece el evento de click sobre cada serie
   let series = document.querySelectorAll('.cardTodosItems');
   for (s of series) {
      s.addEventListener('click', seriePulsada);
   }
}

function seriePulsada(e) {
   let idSerie = e.currentTarget.firstElementChild.alt;
   window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + idSerie + "&type=tv";
}

//Funcion que muestra los filtros incluidos en el array 'generosSeries' marcados en el desplegable de 'Filtrar'
function establecerFiltros() {
   let divGeneros = document.querySelector('#divGeneros');
   for (serie of generosSeries) {
      const generoElement = document.createElement('div');
      generoElement.classList.add('genero');
      generoElement.id = serie.id;
      generoElement.innerText = serie.name;
      divGeneros.appendChild(generoElement);
   }

   let generos = divGeneros.childNodes;
   for (g of generos) {
      g.addEventListener('click', agregarEnArrayParaFiltrar);
   }
}

//Funcion que agrega los filtros seleccionados al array 'generoSeleccionado'.
function agregarEnArrayParaFiltrar(e) {
   var id = e.currentTarget.id; //Se obtiene el id del genero seleccionado

   if (!generoSeleccionado.includes(id)) {
      //Se agrega el genero seleccionado al array 
      generoSeleccionado.push(id);
      //Se cambia el estilo del boton para que aparezca como marcado
      let btnGenero = document.getElementById(id);
      btnGenero.style.backgroundColor = "#221225";
      btnGenero.style.color = "white";
      //Se permite usar el boton de buscar
      const btnBuscar = document.querySelector('#btnFiltrar');
      btnBuscar.disabled = false;
   } else {
      //Se elimina el id del array 
      generoSeleccionado.forEach((identificador, indice) => {
         if (identificador == id) {
            generoSeleccionado.splice(indice, 1);
         }
      })
      //Se cambia el estilo para que aparezca desactivado el boton
      let btnGenero = document.getElementById(id);
      btnGenero.style.backgroundColor = "white";
      btnGenero.style.color = "black";
   }

   if (generoSeleccionado.length == 0) {
      const btnBuscar = document.querySelector('#btnFiltrar');
      btnBuscar.disabled = true;
   }
}

//Funcion que recupera las series que cumplan los filtros establecidos en el array 'generoSeleccionado'
function buscarPorFiltro() {

   //Si la columna de los filtros aparece en la parte superior, una vez que se pulsa el boton filtrar, 
   //se hace un collapse de los generos para dejar espacio y que el usuario pueda ver los resultados bien.
   if (screen.width <= 767) {
      $("#collapseDiv").removeClass("show");
   }

   //Se limpia el container de las series
   var container = document.querySelector('#flex-container');
   container.innerHTML = '';

   fetch(URL_BUSCAR_POR_GENERO_SERIES + generoSeleccionado.join(',') + '&page=' + pageConFiltro, {
      method: 'GET',
      redirect: 'follow',
      headers: new Headers({
         Accept: 'application/json'
      })
   }).then(function (response) {
      if (response.ok)
         return response.json();
      else throw new Error('No se ha podido buscar por el filtro indicado');
   }).then(data => {
      //Se limpia el container de las series
      var container = document.querySelector('#flex-container');
      container.innerHTML = '';

      flagFiltro = true;

      seriesObtenidas = data.results;
      if (Object.keys(seriesObtenidas).length == 0) {
         mostrarMensajeNoHayResultados();
      } else {
         $("#btn-mostrarMas").css("display", "block");
         mostrarTarjetas(seriesObtenidas);
      }
   }).catch(function (error) {
      swal({
         title: 'Error',
         text: 'No se ha podido buscar por el filtro indicado',
         icon: 'error',
      }).then(() => {
         window.location.href = URLBASE_POSTMOVIE;
      });
   });
}

function mostrarMensajeNoHayResultados() {
   $("#btn-mostrarMas").css("display", "none");
   var container = document.querySelector('#flex-container');
   container.innerHTML = `
   <div id="containerMensajeNoResultsFiltro">
      <h4 class="m-5">No se han encontrado series para este filtro.</h4>
   </div>
   `
}

window.onload = function () {
   recuperarSeries();

   const btnMostrarMas = document.querySelector('#btn-mostrarMas');
   btnMostrarMas.addEventListener('click', recuperarSeries);

   establecerFiltros();

   const btnBuscar = document.querySelector('#btnFiltrar');
   btnBuscar.addEventListener('click', buscarPorFiltro);
}