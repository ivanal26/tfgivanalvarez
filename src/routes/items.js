const express = require('express');
const axios = require('axios');
const router = express.Router();
const servicioItems = require('../servicios/servicioItems');

router.get('/buscar', function (req, res, next) {
    res.render('items/itemsBuscados', {
        'queryBuscada': req.query.item
    });
});

router.get('/mostrar', function (req, res, next) {
    if (!req.cookies.jwt) { //Si el usuario no dispone de token jwt (por lo que no esta logeado) no se le permite el acceso
        res.render('login/login');
    } else {
        res.render('items/mostrar');
    }
});


router.get('/obtenerListaValoraciones', function (req, res, next) {
    var idUser = req.query.idUser;
    servicioItems.obtenerListaValoraciones(idUser).then(function (itemsMap) {
        res.setHeader('Content-Type', 'application/json');
        res.json(itemsMap)
    }).catch(function () {
        res.status(500).send('Error al recuperar la lista de valoraciones')
    });
})

router.get('/obtenerEstadisticas', function (req, res, next) {
    var idUser = req.query.idUser;
    servicioItems.obtenerEstadisticas(idUser).then(function (itemsMap) {
        res.setHeader('Content-Type', 'application/json');
        res.json(itemsMap);
    }).catch(function () {
        res.status(500).send("Error al recuperar las estadisticas de los items");
    })
})

router.post('/agregarAListaSeguimiento', function (req, res, next) {

    var datos = {
        "idUsuario": req.body.idUsuario,
        "idItem": req.body.idItem,
        "tipoItem": req.body.tipoItem,
        "title": req.body.title,
        "poster": req.body.poster
    }

    servicioItems.agregarAListaSeguimiento(datos).then(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch(function () {
        res.status(500).send("Error al agregar el item a la lista de seguimiento");
    })
})

router.delete('/eliminarDeListaSeguimiento', function (req, res, next) {
    var idUsuario = req.query.idUsuario;
    var idItem = req.query.idItem;

    servicioItems.eliminarDeListaSeguimiento(idUsuario, idItem).then(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch(function () {
        res.status(500).send("Error al eliminar el item de la lista de seguimiento");
    })
})

router.get('/obtenerItemDeListaSeg', function (req, res, next) {
    var idItem = req.query.idItem;
    var idUsuario = req.query.idUsuario;

    servicioItems.obtenerItemDeListaSeg(idItem, idUsuario).then(function (item) {
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }).catch(function () {
        res.status(500).send('Error al recuperar el item de la lista de seguimiento');
    });
})

router.get('/obtenerTodosListaSeg', function (req, res, next) {
    var idUsuario = req.query.idUsuario;

    servicioItems.obtenerTodosListaSeg(idUsuario).then(function (items) {
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }).catch(function () {
        res.status(500).send('Error al recuperar los items de la lista de seguimiento')
    })
})

router.get('/obtenerItemsMejorValorados', function (req, res, next) {
    var idUsuario = req.query.idUser;
    servicioItems.obtenerItemsMejorValorados(idUsuario).then(function (itemMap) {
        res.setHeader('Content-Type', 'application/json');
        res.json(itemMap);
    }).catch(function () {
        res.status(500).send("Error al agregar el item a la lista de seguimiento");
    })
})



module.exports = router;