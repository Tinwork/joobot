const express    = require('express'),
      engine     = require('ejs-locals'),
      path       = require('path'),
      routes     = require('./src/config/routes'),
      bodyParser = require('body-parser');

// Create our app
const app = express();

app.engine('ejs', engine);

app.use('/static', express.static(__dirname + '/public'));

app.use(bodyParser.json({
  limit: '300mb',
  extended: true,
  parameterLimit: 1000
}))
app.use(bodyParser.urlencoded({
  limit: '300mb',
  extended: true,
  parameterLimit: 1000
}))

// Set EJS as view engine
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use('/', routes);

app.use(function(req, res, next) {
    let err = Object.assign(Object.create({}), {
        status: 404
    });
    next(err);
});

module.exports = app;