const db = require('../database/db'); //Se obtiene la conexion a la BD
const mysqlSeries = {};

mysqlSeries.agregarValoracionSerie = async(datos) => {
    var idSerie = datos.idSerie;
    var idUsuario = datos.idUsuario;
    var valoracionEmitida = datos.valoracionEmitida;
    var tituloSerie = datos.titulo;
    var poster = datos.poster;

    const connection = await db.getConnection();

    const result = await connection.execute('INSERT INTO `calificacionesseries`(`idSerie`, `idUsuario`,`calificacion`,`titulo`,`poster_path`) VALUES (?,?,?,?,?)', 
    [idSerie,idUsuario,valoracionEmitida,tituloSerie,poster]);
}

mysqlSeries.obtenerValoracionSerie = async(idUsuario,idSerie) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT * FROM `calificacionesseries` WHERE `idSerie` = ? AND `idUsuario` = ?', [idSerie,idUsuario]);
    return rows[0];
}

mysqlSeries.obtenerMediaSerie = async(idSerie) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT AVG(`calificacion`) FROM `calificacionesseries` WHERE `idSerie` = ?', [idSerie]);
    return rows[0];
}

mysqlSeries.actualizarValoracionSerie = async(idUsuario,idSerie,nuevaValoracion) => {
    const connection = await db.getConnection();
    
    const result = await connection.execute('UPDATE `calificacionesseries` SET `calificacion` = ?'
                        + ' WHERE `idUsuario` = ? AND `idSerie` = ?', [nuevaValoracion,idUsuario,idSerie]);
}

module.exports = mysqlSeries;