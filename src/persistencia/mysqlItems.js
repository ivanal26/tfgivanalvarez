const db = require('../database/db'); //Se obtiene la conexion a la BD
const mysqlItems = {};

mysqlItems.obtenerListaValoraciones = async(idUser) => {
    const connection = await db.getConnection();
    var map = new Map();
    const [rows, fields] = await connection.execute('SELECT * FROM `calificacionespeliculas` WHERE `idUsuario` = ?', [idUser]);
    map.set('peliculas',rows);
    const [rows2, fields2] = await connection.execute('SELECT * FROM `calificacionesseries` WHERE `idUsuario` = ?', [idUser]);
    map.set('series',rows2);

    return Object.fromEntries(map);;
}

mysqlItems.obtenerEstadisticas = async(idUser) => {
    const connection = await db.getConnection();
    var map = new Map();
    //Peliculas
    const [rows, fields] = await connection.execute('SELECT AVG(`calificacion`) FROM `calificacionespeliculas` WHERE `idUsuario` = ?', [idUser]);
    map.set('mediaPeliculas',rows);
    const [rows2, fields2] = await connection.execute('SELECT COUNT(*) FROM `calificacionespeliculas` WHERE `idUsuario` = ?', [idUser]);
    map.set('totalPeliculasValoradas',rows2);
    //Series
    const [rows3, fields3] = await connection.execute('SELECT AVG(`calificacion`) FROM `calificacionesseries` WHERE `idUsuario` = ?', [idUser]);
    map.set('mediaSeries',rows3);
    const [rows4, fields4] = await connection.execute('SELECT COUNT(*) FROM `calificacionesseries` WHERE `idUsuario` = ?', [idUser]);
    map.set('totalSeriesValoradas',rows4);
    return Object.fromEntries(map);
}

mysqlItems.agregarAListaSeguimiento = async(datos) => {
    var idUsuario = datos.idUsuario;
    var idItem = datos.idItem;
    var tipoItem = datos.tipoItem;
    var title = datos.title;
    var poster = datos.poster

    const connection = await db.getConnection();

    const result = await connection.execute('INSERT INTO `listaseguimiento`(`idUsuario`, `idItem`,`tipoItem`,`title`,`poster`) VALUES (?,?,?,?,?)', 
    [idUsuario,idItem,tipoItem,title,poster]);
}

mysqlItems.obtenerItemDeListaSeg = async(idItem, idUsuario) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT * FROM `listaseguimiento` WHERE `idItem` = ? AND `idUsuario` = ?', [idItem, idUsuario]);
    return rows[0];
}

mysqlItems.eliminarDeListaSeguimiento = async(idUsuario,idItem) => {
    const connection = await db.getConnection();
    const result = await connection.execute('DELETE FROM `listaseguimiento` WHERE `idUsuario`=? AND `idItem` = ?;', [idUsuario, idItem]);
    return result;
}

mysqlItems.obtenerTodosListaSeg = async(idUsuario) => {
    const connection = await db.getConnection();

    const [rows, fields] = await connection.execute('SELECT * FROM `listaseguimiento` WHERE `idUsuario` = ?', [idUsuario]);
    return rows;
}

mysqlItems.obtenerItemsMejorValorados = async(idUsuario) => {
    const connection = await db.getConnection();
    var map = new Map();

    //Pelicula mejor valorada
    const [rows, fields] = await connection.execute('SELECT `idPelicula`, `idUsuario`, `calificacion`, `poster_path` FROM `calificacionespeliculas` WHERE `calificacion` = (SELECT MAX(calificacion) FROM `calificacionespeliculas` WHERE `idUsuario` = ?) and `idUsuario` = ?', [idUsuario,idUsuario]);
    map.set('peliculaTop', rows[rows.length - 1]);
    //Serie mejor valorada
    const [rows2, fields2] = await connection.execute('SELECT `idSerie`, `idUsuario`, `calificacion`, `poster_path` FROM `calificacionesseries` WHERE `calificacion` = (SELECT MAX(calificacion) FROM `calificacionesseries` WHERE `idUsuario` = ?) and `idUsuario` = ?', [idUsuario,idUsuario]);
    map.set('serieTop', rows2[rows2.length - 1]);
    
    return Object.fromEntries(map);
}

module.exports = mysqlItems;
