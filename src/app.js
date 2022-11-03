var createError = require('http-errors');
//invocamos express
var express = require('express');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars')

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var peliculasRouter = require('./routes/peliculas');
var seriesRouter = require('./routes/series');
var itemsRouter = require('./routes/items')

//Invocacion de dotenv
const dotenv = require('dotenv');
dotenv.config({path: './.env'}) //le indicamos donde esta el fichero .env

//Invocacion de modulo de cifrado (bcryptjs)
const bcryptjs = require('bcryptjs');

//Variables de session 
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({ 
  defaultLayout: 'layout', 
  layoutsDir: path.join(app.get('views') , 'layouts'),
  partialsDir : path.join(app.get('views') , 'partials'),
  extname: '.hbs',
  helpers: {
    if : function(condition, options){
      if (condition)
        return options.fn(this);
      else
        return options.inverse(this);
    }
  } 
}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //para trabajar con las cookies
app.use(express.static(path.join(__dirname, 'public'))); // se indica donde se encuentran los archivos estaticos (publicos)


// Routes
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/peliculas', peliculasRouter);
app.use('/series',seriesRouter);
app.use('/items', itemsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.errorStatus = err.status; // Esta línea es importante si activamos la seguridad, si la volvemos a desactivar en la plantilla (p.e error.hbs) usar error.status

  // render the error page 
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
