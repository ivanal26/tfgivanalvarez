const mysqlItems = require('../persistencia/mysqlItems');
const servicioItems = {};

servicioItems.obtenerListaValoraciones = async (idUsuario) => {
    var result = await mysqlItems.obtenerListaValoraciones(idUsuario);
    return result;
}

servicioItems.obtenerEstadisticas = async (idUsuario) => {
    var result = await mysqlItems.obtenerEstadisticas(idUsuario);
    return result;
}

servicioItems.agregarAListaSeguimiento = async (datos) => {
    var datos = {
        "idUsuario" : datos.idUsuario,
        "idItem" : datos.idItem,
        "tipoItem" : datos.tipoItem,
        "title" : datos.title,
        "poster" : datos.poster
    }
    var result = await mysqlItems.agregarAListaSeguimiento(datos);
    return result;
}

servicioItems.eliminarDeListaSeguimiento = async (idUsuario,idItem) => {
    var result = await mysqlItems.eliminarDeListaSeguimiento(idUsuario,idItem);
    return result;
}

servicioItems.obtenerItemDeListaSeg = async (idItem,idUsuario) => {
    var result = await mysqlItems.obtenerItemDeListaSeg(idItem,idUsuario);
    if (typeof(result) === 'undefined'){
        return false;
    }else {
        return result;
    }
}

servicioItems.obtenerTodosListaSeg = async (idUsuario) => {
    var result = await mysqlItems.obtenerTodosListaSeg(idUsuario);
    return result;
}

servicioItems.obtenerItemsMejorValorados = async (idUsuario) => {
    var result = await mysqlItems.obtenerItemsMejorValorados(idUsuario);
    return result;
}

module.exports = servicioItems;