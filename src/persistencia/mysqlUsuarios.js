const db = require('../database/db'); //Se obtiene la conexion a la BD
const mysqlUsuarios = {};

mysqlUsuarios.save = async (usuario) => {
    const connection = await db.getConnection();

    const result = await connection.execute('INSERT INTO `Usuarios` SET `email` = ?, `nombre` = ?, `apellidos` = ?, '
    + '`nombreUsuario` = ?, `pass` = ?', 
    [usuario['email'], usuario['nombre'],
    usuario['apellidos'], usuario['username'], usuario['pass']]);

    return result;
}

mysqlUsuarios.getById = async(id) => {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM `Usuarios` WHERE `id` = ?', [id]);
    return rows[0];
}

mysqlUsuarios.getByUserName = async(username) => {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM `Usuarios` WHERE `nombreUsuario` = ?', [username]);
    return rows[0];
}

mysqlUsuarios.getByEmail = async(email) => {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM `Usuarios` WHERE `email` = ?', [email]);
    return rows[0];
}

mysqlUsuarios.getAll = async () => {
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM `Usuarios`');

    return rows;
}

mysqlUsuarios.update = async(usuario) => {
    const connection = await db.getConnection();
    
    const [rows, fields] = await connection.execute('UPDATE `Usuarios` SET `email` = ? , `nombre` = ?,' 
                        + '`apellidos` = ?, `nombreUsuario` = ?, `pass` = ?'
                        + ' WHERE `id` = ?', [usuario['email'], usuario['nombre'], usuario['apellidos'], 
                        usuario['usenarme'], usuario['pass'],usuario['id']]);
}

mysqlUsuarios.updateAvatar = async(avatar,id) => {
    const connection = await db.getConnection();
    
    const result = await connection.execute('UPDATE `Usuarios` SET `fotoAvatar` = ?'
                        + ' WHERE `id` = ?', [avatar,id]);
}

module.exports = mysqlUsuarios;