var generoSeleccionado = [];
const generosPeliculas = [{ "id": 28, "name": "Acción" }, { "id": 12, "name": "Aventura" }, { "id": 16, "name": "Animación" },
{ "id": 35, "name": "Comedia" }, { "id": 80, "name": "Crimen" }, { "id": 99, "name": "Documental" },
{ "id": 18, "name": "Drama" }, { "id": 10751, "name": "Familia" }, { "id": 14, "name": "Fantasía" },
{ "id": 36, "name": "Historia" }, { "id": 27, "name": "Terror" }, { "id": 10402, "name": "Música" },
{ "id": 9648, "name": "Misterio" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Ciencia ficción" },
{ "id": 10770, "name": "Película de TV" }, { "id": 53, "name": "Suspense" }, { "id": 10752, "name": "Bélica" }, { "id": 37, "name": "Western" }];

var flagFiltro = false;
var pageSinFiltro = 0;
var pageConFiltro = 1;

function recuperarPeliculas() {
   
   if (!flagFiltro) {
      pageSinFiltro++;
      fetch(URL_DISCOVER_MOVIES + pageSinFiltro, {
         method: 'GET',
         redirect: 'follow',
         headers: new Headers({
            Accept: 'application/json'
         })
      }).then(function (response) {
         if (response.ok)
            return response.json();
         else throw new Error('No se han podido recuperar las peliculas');
      }).then(data => {
         peliculasObtenidas = data.results;
         mostrarTarjetas(peliculasObtenidas);
      }).catch(function (error) {
         swal({
            title: 'Error',
            text: 'No se han podido recuperar las peliculas',
            icon: 'error',
         }).then(() => {
            window.location.href = URLBASE_POSTMOVIE;
         });
      });
   } else {
      pageConFiltro++;
      fetch(URL_BUSCAR_POR_GENERO_MOVIES + generoSeleccionado.join(',') + '&page=' + pageConFiltro, {
         method: 'GET',
         redirect: 'follow',
         headers: new Headers({
            Accept: 'application/json'
         })
      }).then(function (response) {
         if (response.ok)
            return response.json();
         else throw new Error('No se han podido recuperar las peliculas aplicando el filtro indicado');
      }).then(data => {
         peliculasObtenidas = data.results;
         mostrarTarjetas(peliculasObtenidas);
      }).catch(function (error) {
         swal({
            title: 'Error',
            text: 'No se han podido recuperar las peliculas aplicando el filtro indicado',
            icon: 'error',
         }).then(() => {
            location.reload();
         });
      });
   }
}

function mostrarTarjetas(peliculasAMostrar) {
   var container = document.querySelector('#flex-container');

   for (let i = 0; i < 20; i++) {
      if (peliculasAMostrar[i]?.poster_path) {
         const peliElement = document.createElement('div');
         peliElement.classList.add('cardTodosItems');
         peliElement.innerHTML = `
      <img src="${URL_BASE_IMG_W500 + peliculasAMostrar[i].poster_path}" alt="${peliculasAMostrar[i].id}">`
         container.appendChild(peliElement);
      } else {
         continue;
      }
   }

   //Se establece el evento de click sobre cada pelicula
   let peliculas = document.querySelectorAll('.cardTodosItems');
   for (p of peliculas) {
      p.addEventListener('click', peliPulsada);
   }
}

function peliPulsada(e) {
   let idPelicula = e.currentTarget.firstElementChild.alt;
   window.location.href = URLBASE_POSTMOVIE+"items/mostrar?idItem=" + idPelicula + "&type=movie";
}

//Funcion que muestra los filtros incluidos en el array 'generosPeliculas' marcados en el desplegable de 'Filtrar'
function establecerFiltros() {
   let divGeneros = document.querySelector('#divGeneros');
   for (pelicula of generosPeliculas) {
      const generoElement = document.createElement('div');
      generoElement.classList.add('genero');
      generoElement.id = pelicula.id;
      generoElement.innerText = pelicula.name;
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

//Funcion que recupera las peliculas que cumplan los filtros establecidos en el array 'generoSeleccionado'
function buscarPorFiltro() {

   //Si la columna de los filtros aparece en la parte superior, una vez que se pulsa el boton filtrar, 
   //se hace un collapse de los generos para dejar espacio y que el usuario pueda ver bien los resultados
   if (screen.width <= 767) {
      $("#collapseDiv").removeClass("show");
   }

   //Se limpia el container de las peliculas
   var container = document.querySelector('#flex-container');
   container.innerHTML = '';

   fetch(URL_BUSCAR_POR_GENERO_MOVIES + generoSeleccionado.join(',') + '&page=' + pageConFiltro, {
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
      //Se limpia el container de las peliculas
      var container = document.querySelector('#flex-container');
      container.innerHTML = '';

      flagFiltro = true;

      peliculasObtenidas = data.results;

      if (Object.keys(peliculasObtenidas).length == 0) {
         mostrarMensajeNoHayResultados();
      } else {
         $("#btn-mostrarMas").css("display", "block");
         mostrarTarjetas(peliculasObtenidas);
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
      <h4 class="m-5">No se han encontrado peliculas para este filtro.</h4>
   </div>
   `
}



window.onload = function () {

   recuperarPeliculas();

   const btnMostrarMas = document.querySelector('#btn-mostrarMas');
   btnMostrarMas.addEventListener('click', recuperarPeliculas);

   establecerFiltros();

   const btnBuscar = document.querySelector('#btnFiltrar');
   btnBuscar.addEventListener('click', buscarPorFiltro);

}