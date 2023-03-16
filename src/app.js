var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// ? Routes...
const indexRoute = require('./routes/index')
const AuthRoute = require('./routes/Auth/authRoute')

class App {

  constructor() {
    this.router = express.Router()

    // craete express js application
    this.app = express()
    console.log(`Worker ${process.pid} started`)

    // configure application
    this.config()

    // add router for Web APP
    this.web()

    // add api for Rest API
    this.api()

    // Error Handling...
    // this.ErrorHandling()

    // this.swagger();

  }

  // boottsrap the application
  static bootstrap() {
    return new App()
  }

  api() {
    // ? setup APIs...
    new indexRoute(this.router)
    new AuthRoute(this.router)

    // use router as middleware
    this.app.use('/api', this.router)
  }

  // swagger

  // Configure application
  config() {
    this.app.use('/public', express.static('public'))

    // add static paths
    this.app.use(express.static(path.join(__dirname, 'public')))

    // configure ejs
    this.app.set('views', path.join(__dirname, 'views'))
    this.app.set('view engine', 'ejs')

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))

    this.app.use(async function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Methods", "Access-Control-Allow-Headers, crossdomain, withcredentials, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, TokenType")
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
      next()
    })

    this.app.use(cors({ origin: process.env.CORS_URL, optionsSuccessStatus: 200 }))
    // mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"))
    this.app.use(express.static(path.join(__dirname, 'public')))

  }

  // ErrorHandling() {
  //   this.app.use((req, res, next) => { next() })
  // }

  web() {
    this.app.use('/', this.router)
  }
}

exports.App = App


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });             



// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
