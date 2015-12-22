var cool = require('cool-ascii-faces');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



var valid_logins = ['mchow', 'kaytea', 'CindyLytle', 'BenHarris',
	'JeremyMaletic', 
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
	'BenJohnson'];






app.get('/latest.json', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var login = request.body.login;
	if(login != ""){
		db.collection('checkins', function (error1, coll) {
			coll.find({"login":login}, function(err, results) {
				
			}).sort({"created_at":-1}).toArray( function (error2, data) {
				response.send(data[0]);
			}); 
		});
	} else {
		response.send({});
	}
});

app.post('/sendLocation', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var all_fields_complete = false;
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var message = request.body.message;
	var created_at = new Date();
	if (login != "" && lat != "" && lng != "" && message != "") {all_fields_complete = true};
	var errMsg = {"error":"Whoops, something is wrong with your data!"};

	if (valid_logins.indexOf(login) > -1 && all_fields_complete) {
		var toInsert = {
			"login": login,
			"lat": lat,
			"lng": lng,
			"message": message,
			"created_at":created_at
		};
		db.collection('checkins', function(error, coll) {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					response.status(500);
				} else{
					response.status(200);
					var document = coll.find({}).toArray(function (error2, data){
						response.send(data);

					});
				}
			});
		});
	} else {
		response.status(400);
		response.send(errMsg);
	}
});

app.get('/', function (request, response) {
	var html = "<!doctype html><html><head></head><body>";
  db.collection('checkins', function (error1, coll) {
  	coll.find().sort({"created_at":-1}).toArray(function (error2, data){
  		for(var i = 0; i < data.length; i++) {
  			var login = data[i]['login'];
  			var message = data[i]['message'];
  			var lat = data[i]['lat'];
  			var lng = data[i]['lng'];
  			var created_at = data[i]['created_at'];
  			var info_str = login+ " checked in at " +lat+ ", " +lng+ " on " +created_at+ " and wrote " +message;
  			html += "<p>" +info_str+ "</p>";
  		}
  		html += "</body></html>";
  		response.send(html);
  	});
  });

});



app.get('/cool', function (request,response) {
	response.send(cool());
});

app.get('/lab8', function (req, res) {
	res.sendFile(__dirname + '/public/lab8.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


