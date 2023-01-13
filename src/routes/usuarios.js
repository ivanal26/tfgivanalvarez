const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const servicioUsuarios = require('../servicios/servicioUsuarios');
const { promisify } = require('util');
const { token } = require('morgan');

//Router para mostrar las vistas
router.get('/vistas/login', function (req, res, next) {
    res.render('login/login', { alert: false });
})

router.get('/vistas/registrar', function (req, res, next) {
    res.render('register/registro')
})

router.get('/vistas/perfil', function (req, res, next) {
    if (!req.cookies.jwt) {
        res.render('login/login');
    } else {
        res.render('users/perfil');
    }
})

router.get('/vistas/preguntas', function (req, res, next) {
    res.render('preguntas');
})

//Router para hacer acciones
router.get('/logout', function (req, res, next) {
    res.clearCookie('jwt');
    return res.redirect('/')
})

router.post('/', async function (req, res, next) {
    //Se obtienen los valores del formulario
    const pass = req.body.password[0]; //Vienen los dos inputs del password, se coge el primero
    let passHash = await bcrypt.hash(pass.toString(), 8);
    usuario = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        username: req.body.username,
        email: req.body.email,
        pass: passHash
    }

    //Todos los campos son requeridos
    if (!usuario.nombre || !usuario.apellidos || !usuario.username || !usuario.email || !req.body.password[0] || !req.body.password[1]) {
        res.render('register/registro', {
            alert: true,
            alertTitle: 'Advertencia',
            alertMessage: "Todos los campos son obligatorios",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: '/usuarios/vistas/registrar'
        })
        //Las contraseñas deben coincidir
    } else if (req.body.password[0] != req.body.password[1]) {
        res.render('register/registro', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: "Las contraseñas no coinciden",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: '/usuarios/vistas/registrar'
        })
    } else {
        //El usuario no puede existir en la BD
        try {
            var usuarioByUsername = await servicioUsuarios.obtenerUserByUserName(usuario.username);
            if (usuarioByUsername) {
                res.render('register/registro', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: "El nombre de usuario introducido ya existe",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: '/usuarios/vistas/registrar'
                })
            }
        } catch (error) { //No se ha podido recuperar, por tanto, no existe en la BD
            res.render('register/registro', {
                alert: true,
                alertTitle: 'Registro completado',
                alertMessage: "El usuario ha sido registrado",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: false,
                ruta: '/usuarios/vistas/login'
            })
            servicioUsuarios.registrarUsuario(usuario);
        }
    }

});

router.post('/login', async function (req, res, next) {
    const username = req.body.userLogin;
    const pass = req.body.passLogin;
    if (!username || !pass) {
        res.render('login/login', {
            alert: true,
            alertTitle: 'Advertencia',
            alertMessage: "Ingrese un usuario y una contraseña",
            alertIcon: 'info',
            showConfirmButton: true,
            timer: false,
            ruta: '/usuarios/vistas/login'
        })
    } else {
        try {
            let usuario = await servicioUsuarios.obtenerUserByUserName(username);
            let result = await bcrypt.compare(pass, usuario.pass);
            if (!result || !usuario) {
                res.render('login/login', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: "Usuario y/o contraseña incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: '/usuarios/vistas/login'
                })
            } else { //Inicio de sesion correcto

                const idUsuario = usuario.id;
                //Se genera el token JWT
                const token = jwt.sign({ id: idUsuario }, process.env.JWT_SECRET, {  //Se le pasa el id, la contraseña (ya que es con ella con la que se firma el token). Se va a usar la clave secreta y el resto de datos necesarios del archivo de variables de entorno 
                    expiresIn: process.env.JWT_TIEMPO_EXPIRACION
                })

                //Token sin tiempo de expiracion: 
                //const token = jwt.sign({id:idUsuario}, process.env.JWT_SECRET);

                //Cookies
                const opcionesCookie = {
                    //Sin tiempo de expiracion (no expires) para que sea una cookie de session
                    //expires: new Date(Date.now() + process.env.COOKIE_EXPIRACION * 24 * 60 * 60 * 1000),  
                    httpOnly: false
                }
                res.cookie('jwt', token, opcionesCookie) //Se define el nombre para la cookie. Dicha cookie va a ser el propio token JWT
                res.render('login/login', {
                    alert: true,
                    alertTitle: 'Conexión exitosa',
                    alertMessage: "Inicio de sesión correcto",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: '/'
                })
            }

        } catch (error) {
            //Ha ocurrido un error al recuper el usuario de la BD
            res.render('login/login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: "Error al iniciar sesión",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: '/usuarios/vistas/login'
            })
        }
    }
})

router.get('/', function (req, res, next) {
    var idUsuarioLogeado = req.query.idUser;
    servicioUsuarios.obtenerUserById(idUsuarioLogeado).then(function (usuario) {
        res.setHeader('Content-Type', 'application/json');
        res.json(usuario);
    }).catch(function () {
        res.status(500).send('Error al recuperar el usuario logeado');
    });
})

router.put('/avatar', async function (req, res, next) {
    var nuevoAvatar = req.body.avatar;
    var idUsuario = req.body.idUsuario;

    await servicioUsuarios.actualizarAvatarUsuario(nuevoAvatar, idUsuario).then(function () {
        res.status(204).send("Avatar actualizado");
    }).catch(function () {
        res.status(500).send("Error: No se ha podido actualizar al usuario");
    });
})

module.exports = router;