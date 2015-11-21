var cool = require('cool-ascii-faces');
/*var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});*/

var cors = require('cors');
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
//app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/*
var valid_logins = {
	"login": ['mchow', 'kaytea', 'CindyLytle', 'BenHarris', 'JeremyMaletic', 
	'LeeMiller', 'EricDapper', 'RichRumfelt', 'VanAmmerman', 'VicJohnson', 
	'ErinHolleman', 'PatFitzgerald', 'CheriVasquez', 'HarleyRhoden', 
	'JanetGage', 'HarleyConnell', 'GlendaMaletic', 'JeffSoulen', 'MarkHair', 
	'RichardDrake', 'CalvinStruthers', 'LeslieDapper', 'JefflynGage', 
	'PaulRamsey', 'BobPicky', 'RonConnelly', 'FrancieCarmody', 
	'ColleenSayers', 'TomDapper', 'MatthewKerr', 'RichBiggerstaff', 
	'MarkHarris', 'JerryRumfelt', 'JoshWright', 'LindyContreras', 
	'CameronGregory', 'MarkStruthers', 'TravisJohnson', 'RobertHeller', 
	'CalvinMoseley', 'HawkVasquez', 'LayneDapper', 'HarleyIsdale', 
	'GaylaSoulen', 'MatthewRichards', 'RoyDuke', 'GaylaRodriquez', 
	'FrancieGeraghty', 'LisaLytle', 'ErinHair', 'CalvinGraham', 'VanRhoden', 
	'KeithRumfelt', 'GlendaSmith', 'KathrynJohnson', 'FredVandeVorde', 
	'SheriMcKelvey', 'RoyMiller', 'PatIsdale', 'JoseRodriquez', 
	'KelleyRumfelt', 'JanetKinsey', 'RonCampbell', 'BenKerr', 'RobDennison', 
	'BobOwens', 'CherylLytle', 'LisaSoulen', 'TravisDuke', 'CindyGregory', 
	'JoyceVandeVorde', 'MatthewScholl', 'RobJohnson', 'EricHawthorn', 
	'CameronRodriquez', 'JoshRamsey', 'CalvinDuke', 'SheriHeller', 
	'LeaAmmerman', 'LayneVasquez', 'IMConnell', 'BenHauenstein', 
	'ColleenKerr', 'HawkRichards', 'LeaIsdale', 'RickSoulen', 'RoyMcFatter', 
	'KyleContreras', 'MaryHeller', 'KathrynFitzgerald', 'JanetRiedel', 
	'PatHawthorn', 'KeithHauenstein', 'BenRichards', 'RickVasquez', 
	'KelleyAmmerman', 'EvanConnelly', 'KendallRumfelt', 'TravisIsdale', 
	'RobContreras', 'JavierRussell', 'ColleenCampbell', 'JeremyConnelly', 
	'BenKinsey', 'JanetScholl', 'PaulaLewis', 'LeslieMcFatter', 
	'MatthewMcAda', 'LeeMuilman', 'KyleMoseley', 'JeffRhoden', 
	'AnitaHolleman', 'JefflynMcKelvey', 'BobContreras', 'RobFitzgerald', 
	'BenJohnson']};


function update_logins(request, response, next) {
	db.collection('valid_logins', function (error, coll) {
		var id = coll.update(
		{}
		valid_logins,
		{upsert: true}
			);
	});
}

*/

app.post('*', function (request, response, next) {
	//update_logins(request, response, next);
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var message = request.body.message;
	var errMsg = {"error":"Whoops, something is wrong with your data!"};
	/*if (login == db.collection('valid_logins') function(error, coll){
		var id = coll.find( {'login':login});
	}) {*/
		var toInsert = {
			"login": login,
			"lat": lat,
			"lng": lng,
			"message": message
		};
		db.collection('checkins', function(error, coll) {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					response.status(500);
				} else{
					response.status(200);
					response.send(toInsert);
				}
			});
		});
//	} else {
//		response.send(errMsg);
//	}
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


