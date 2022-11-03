
function contenidoCargado() {
    var cookies = document.cookie;
    var token = cookies.split('=')
    var tokenJWT = 0;
    //Se han separado las cookies. Si encuentra el jwt lo almacena en la variable tokenJWT si no, pues seguira con el valor 0 (false)
    for (let i = 0; i<token.length;i++){
        if (token[i]==='jwt') { 
            tokenJWT = token[i+1];
        }
    }
    
    if (tokenJWT) {
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