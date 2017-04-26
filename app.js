const express    = require('express'),
      ejs        = require('ejs'),
      path       = require('path'),
      routes     = require('./src/config/routes'),
      bodyParser = require('body-parser');

// Create our app
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

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