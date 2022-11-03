const express = require('express');
const axios = require('axios');
const router = express.Router();
const servicioPeliculas = require('../servicios/servicioPeliculas');

router.get('/mostrar', async function (req, res, next) {
    if (!req.cookies.jwt) { //Si el usuario no dispone de token jwt (por lo que no esta logeado) no se le permite el acceso
        res.render('login/login');
    } else {
        res.render('items/peliculas');
    }
})

router.post('/agregarValoracionPelicula', async function (req, res, next) {
    var datos = {
        "idUsuario": req.body.idUsuario,
        "idPelicula": req.body.idPelicula,
        "valoracionEmitida": req.body.valoracionEmitida,
        "poster": req.body.poster,
        "title": req.body.title
    };
    var result = await servicioPeliculas.agregarValoracionPelicula(datos).then(function () {
        res.status(200).send(result);
    }).catch(function (e) {
        res.status(500).send("Error al valorar la pelicula. No se ha podido crear la valoración");
    });
})

router.put('/actualizarValoracionPelicula', function (req, res, next) {
    var idUsuario = req.body.idUsuario;
    var idPelicula = req.body.idPelicula;
    var nuevaValoracion = req.body.valoracionEmitida;

    servicioPeliculas.actualizarValoracionPelicula(idUsuario, idPelicula, nuevaValoracion).then(function () {
        res.status(204).send("Pelicula actualizada correctamente")
    }).catch(function (e) {
        res.status(500).send("Error al actualizar la pelicula");
    })
})

router.get('/obtenerValoracionPelicula', function (req, res, next) {
    var idUsuario = req.query.idUsuario;
    var idPelicula = req.query.idPelicula;
    servicioPeliculas.obtenerValoracionPelicula(idUsuario, idPelicula).then(function (valoracion) {
        res.setHeader('Content-Type', 'application/json');
        res.json(valoracion);
    }).catch(function () {
        res.status(500).send('Error al recuperar la valoracion de la pelicula')
    });
})

router.get('/obtenerMediaPelicula', function (req, res, next) {
    var idPelicula = req.query.idPelicula;

    servicioPeliculas.obtenerMediaPelicula(idPelicula).then(function (media) {
        res.setHeader('Content-Type', 'application/json');
        res.json(media);
    }).catch(function () {
        res.status(500).send('Error al recuperar la media de las valoraciones de la pelicula')
    });
})

module.exports = router;