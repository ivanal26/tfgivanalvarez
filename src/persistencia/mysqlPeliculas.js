const db = require('../database/db'); //Se obtiene la conexion a la BD
const mysqlPeliculas = {};

mysqlPeliculas.agregarValoracionPelicula = async(datos) => {
    var idPelicula = datos.idPelicula;
    var idUsuario = datos.idUsuario;
    var valoracionEmitida = datos.valoracionEmitida;
    var nombrePelicula = datos.nombrePelicula;
    var poster = datos.poster;

    const connection = await db.getConnection();
    const result = await connection.execute('INSERT INTO `calificacionespeliculas`(`idPelicula`, `idUsuario`,`calificacion`,`titulo`, `poster_path`) VALUES (?,?,?,?,?)', 
    [idPelicula,idUsuario,valoracionEmitida,nombrePelicula,poster]);
}

mysqlPeliculas.obtenerValoracionPelicula = async(idUsuario,idPelicula) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT * FROM `calificacionespeliculas` WHERE `idPelicula` = ? AND `idUsuario` = ?', [idPelicula,idUsuario]);
    return rows[0];
}

mysqlPeliculas.obtenerMediaPelicula = async(idPelicula) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT AVG(`calificacion`) FROM `calificacionespeliculas` WHERE `idPelicula` = ?', [idPelicula]);
    return rows[0];
}

mysqlPeliculas.actualizarValoracionPelicula = async(idUsuario,idPelicula,nuevaValoracion) => {
    const connection = await db.getConnection();
    
    const result = await connection.execute('UPDATE `calificacionespeliculas` SET `calificacion` = ?'
                        + ' WHERE `idUsuario` = ? AND `idPelicula` = ?', [nuevaValoracion,idUsuario,idPelicula]);
}

module.exports = mysqlPeliculas;