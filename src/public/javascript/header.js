
function contenidoCargado() {
    var cookies = document.cookie;

    if (cookies) {
        //Se elimina de la barra de navegacion el 'Login'
        $("#navItemLogin").css("display", "none");
        //Se eimina de la barra de navegacion el 'Registro'
        $("#navItemRegistrar").css("display", "none");
    } else {
        //Se muestra en la barra de navegacion el 'Login'
        $("#navItemLogin").css("display", "inline");
        //Se muestra en la barra de navegacion el 'Registro'
        $("#navItemRegistrar").css("display", "inline");
        //Se quita de la barra de navegacion el 'Cerrar Sesion'
        $("#navItemCerrarSesion").css("display", "none");
    }
}

document.addEventListener('DOMContentLoaded', contenidoCargado);