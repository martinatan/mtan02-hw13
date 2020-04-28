var http = require('http');
var myModule = require('./populate_module.js');
var urlModule = require('url');
const csvtojson = require("csvtojson");

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://martinatan:Figment0310+@cluster0-wcwmu.mongodb.net/test?retryWrites=true&w=majority";

const dbName = "comp20_hw13";
const collName = "companies";
const csvName = "companies.csv";

var queryObj = null;

var port = process.env.PORT || 3000;

console.log("beginning of main");
http.createServer( function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log("before getting the queryObj");

	MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
		if (err) {return console.log(err);}

		var dbObj = db.db(dbName);
		var collObj = dbObj.collection(collName);

		queryObj = urlModule.parse(req.url, true).query;
		console.log(queryObj);

		var company = queryObj.company;
		var ticker = queryObj.ticker;
		console.log ("company is " + company);
		console.log ("ticker is " + ticker);

		res.write("<!DOCTYPE html><html><head><title>Results</title>" +
				  "<link href=\"https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap\"" +
				  "rel=\"stylesheet\"><style>body {background-color: #B4CDED;" +
				  "font-size: 24px; font-family: 'Roboto Slab', Serif;" + 
				  "color: #545E75; margin:auto; text-align:center;}</style>" +
				  "</head><body>");
		var s = null;
		if (company != "") {
			s = collObj.find({Company: company}, {projection: {Company: 1, Ticker: 1, 
				_id: 0}}).stream();

		} else if (ticker != "") {
			s = collObj.find({Ticker: "ticker"}, {projection: {Company: 1, Ticker: 1, 
				_id: 0}}).stream();
		}
		s.on("data", function(item) {res.write(`<p><strong>Company Name:</strong><br/> ${item.Company}</p>
							<p><strong>Ticker Name:</strong> <br/>${item.Ticker}<p>`);});
		s.on("end", function() {res.write(`<p>No other matches found. Try again for more results.</p>`); db.close();});
		
		if (company == "" && ticker == "") {
			res.write("<p>No search term entered. Go back and try again.</p>");
		}
		res.write("</body></html>");
	});
}).listen(port);
console.log('end of main');
