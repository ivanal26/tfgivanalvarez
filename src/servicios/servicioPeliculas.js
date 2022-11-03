const mysqlPeliculas = require('../persistencia/mysqlPeliculas');
const servicioPeliculas = {};

servicioPeliculas.agregarValoracionPelicula = async (datos) => {
    var datos = {
        "idUsuario" : datos.idUsuario,
        "idPelicula" : datos.idPelicula,
        "valoracionEmitida" : datos.valoracionEmitida,
        "nombrePelicula" : datos.title,
        "poster" : datos.poster
    };
    var result = await mysqlPeliculas.agregarValoracionPelicula(datos);
    return result;
}

servicioPeliculas.obtenerValoracionPelicula = async (idUsuario,idPelicula) => {
    
    var result = await mysqlPeliculas.obtenerValoracionPelicula(idUsuario,idPelicula);
    return result;
}

servicioPeliculas.obtenerMediaPelicula = async (idPelicula) => {
    
    var result = await mysqlPeliculas.obtenerMediaPelicula(idPelicula);
    return result;
}

servicioPeliculas.actualizarValoracionPelicula = async(idUsuario,idPelicula,nuevaValoracion) => {
    await mysqlPeliculas.actualizarValoracionPelicula(idUsuario,idPelicula,nuevaValoracion);
}

module.exports = servicioPeliculas;