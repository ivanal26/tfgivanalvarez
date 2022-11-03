const mysqlSeries = require('../persistencia/mysqlSeries');
const servicioSeries = {};

servicioSeries.agregarValoracionSerie = async (datos) => {
    var datos = {
        "idUsuario" : datos.idUsuario,
        "idSerie" : datos.idSerie,
        "valoracionEmitida" : datos.valoracionEmitida,
        "titulo" : datos.titulo,
        "poster" : datos.poster
    };

    var result = await mysqlSeries.agregarValoracionSerie(datos);
    return result;
}

servicioSeries.obtenerValoracionSerie = async (idUsuario,idSerie) => {
    var result = await mysqlSeries.obtenerValoracionSerie(idUsuario,idSerie);
    return result;
}

servicioSeries.obtenerMediaSerie = async (idSerie) => {
    
    var result = await mysqlSeries.obtenerMediaSerie(idSerie);
    return result;
}

servicioSeries.actualizarValoracionSerie = async(idUsuario,idSerie,nuevaValoracion) => {
    await mysqlSeries.actualizarValoracionSerie(idUsuario,idSerie,nuevaValoracion);
}

module.exports = servicioSeries;
