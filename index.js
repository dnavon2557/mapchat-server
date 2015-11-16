var cool = require('cool-ascii-faces');
var cors = require('cors')
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var validator = require('validator'); 

app.set('port', (process.env.PORT || 5000));


var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.post('*', function (request, response) {
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var message = request.body.message;
	var toInsert = {
		"login": login,
		"lat": lat,
		"lng": lng,
		"message": message
	};
	db.collection('checkins', function(error, coll) {
		var id = coll.insert(toInsert, function(error, saved) {
			if (error)
				response.send(500);
			else
				response.send(200);
		});
	});
});

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request,response) {
	response.send(cool());
});

app.get('/lab8', function(req, res) {
	res.sendFile(__dirname + '/public/lab8.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


