var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

var routes = require('./controllers/controller');
app.use('/', routes);

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
	console.log('App running on port: ' + PORT);
})