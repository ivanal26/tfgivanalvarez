//Variables globales para los ficheros public/javascript

//Url y puerto global usado por PostMovie (fetchs)
const URL_LOCALHOST = "http://localhost:3000/";
const URL_RAILWAY = "https://tfgivanalvarez-production.up.railway.app/";
const URLBASE_POSTMOVIE = URL_RAILWAY;

//Constantes TMDB
const API_KEY_TMDB = 'api_key=757fb8851252737383ad88b904de8a95';
const URL_BASE = 'https://api.themoviedb.org/3';
const URL_BASE_IMG_ORIG = 'https://image.tmdb.org/t/p/original/';
const URL_BASE_IMG_W500 = 'https://image.tmdb.org/t/p/w500/';
const URL_MOSTPOPULAR_PELICULAS = URL_BASE + '/movie/popular?api_key=757fb8851252737383ad88b904de8a95&language=es&page=1';
const URL_MOSTPOPULAR_SERIES = URL_BASE + '/tv/popular?api_key=757fb8851252737383ad88b904de8a95&language=es&page=1';
const URL_BUSCARITEMS_POR_PALABRA = URL_BASE + '/search/multi?' + API_KEY_TMDB + '&language=es&page=1&query=';
const URL_DISCOVER_MOVIES = URL_BASE + '/discover/movie?sort_by=popularity.desc&' + API_KEY_TMDB + '&language=es&sort_by=popularity.desc&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&page=';
const URL_BUSCAR_POR_GENERO_MOVIES = URL_BASE + '/discover/movie?sort_by=popularity.desc&' + API_KEY_TMDB + '&language=es&with_genres=';
const URL_DISCOVER_SERIES = URL_BASE + '/discover/tv?sort_by=popularity.desc&' + API_KEY_TMDB + '&language=es&sort_by=popularity.desc&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&page=';
const URL_BUSCAR_POR_GENERO_SERIES = URL_BASE + '/discover/tv?sort_by=popularity.desc&' + API_KEY_TMDB + '&language=es&with_genres=';
