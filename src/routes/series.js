const express = require('express');
const axios = require('axios');
const router = express.Router();
const servicioSeries = require('../servicios/servicioSeries');

router.get('/mostrar', async function (req, res, next) {
   if (!req.cookies.jwt) { //Si el usuario no dispone de token jwt (por lo que no esta logeado) no se le permite el acceso
      res.render('login/login');
   } else {
      res.render('items/series');
   }
})

router.post('/agregarValoracionSerie', async function (req, res, next) {
   var datos = {
       "idUsuario": req.body.idUsuario,
       "idSerie": req.body.idSerie,
       "valoracionEmitida": req.body.valoracionEmitida,
       "titulo": req.body.titulo,
       "poster": req.body.poster
   };
   var result = await servicioSeries.agregarValoracionSerie(datos).then(function () {
       res.status(200).send(result);
   }).catch(function (e) {
       res.status(500).send("Error al valorar la serie.No se ha podido crear la valoración");
   });

   res.send(result);
})

router.get('/obtenerValoracionSerie', function (req, res, next) {
   var idUsuario = req.query.idUsuario;
   var idSerie = req.query.idSerie;
   servicioSeries.obtenerValoracionSerie(idUsuario, idSerie).then(function (valoracion) {
       res.setHeader('Content-Type', 'application/json');
       res.json(valoracion);
   }).catch(function () {
       res.status(500).send('Error al recuperar la valoracion de la serie')
   });
})

router.get('/obtenerMediaSerie', function (req, res, next) {
   var idSerie = req.query.idSerie;
   servicioSeries.obtenerMediaSerie(idSerie).then(function (media) {
       res.setHeader('Content-Type', 'application/json');
       res.json(media);
   }).catch(function () {
       res.status(500).send('Error al recuperar la media de las valoraciones de la serie')
   });
})

router.put('/actualizarValoracionSerie', function (req, res, next) {
   var idUsuario = req.body.idUsuario;
   var idSerie = req.body.idSerie;
   var nuevaValoracion = req.body.valoracionEmitida;

   servicioSeries.actualizarValoracionSerie(idUsuario, idSerie, nuevaValoracion).then(function () {
       res.status(204).send("Serie actualizada correctamente")
   }).catch(function (e) {
       res.status(500).send("Error al actualizar la serie");
   })
})

module.exports = router;