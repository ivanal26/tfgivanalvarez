const mysqlUsuarios = require('../persistencia/mysqlUsuarios');
const servicioUsuarios = {};

servicioUsuarios.registrarUsuario = async (usuario) => {
   
    await mysqlUsuarios.save(usuario);
}

servicioUsuarios.obtenerUserById = async (id) => {
    const usuario = await mysqlUsuarios.getById(id);
    if (usuario === undefined) throw 'Error: No se ha podido recuperar el usuario'; 
    return usuario;
}

servicioUsuarios.obtenerUserByUserName = async (username) => {
    const usuario = await mysqlUsuarios.getByUserName(username); 
    if (usuario === undefined) throw 'Error: No se ha podido recuperar el usuario'; 
    return usuario;
}

servicioUsuarios.obtenerUserByEmail = async (email) => {
    const usuario = await mysqlUsuarios.getByEmail(email);
    if (usuario === undefined) throw 'Error: No se ha podido recuperar el usuario';
    return usuario;
}

servicioUsuarios.obtenerTodosUsuarios = async () => {
    const usuarios = await mysqlUsuarios.getAll();
    return usuarios;
}

servicioUsuarios.actualizarUsuario = async(usuario) => {
    await mysqlUsuarios.update(usuario);
}

servicioUsuarios.actualizarAvatarUsuario = async(avatar,id) => {
    const resultado = await mysqlUsuarios.updateAvatar(avatar,id);
}

module.exports = servicioUsuarios;