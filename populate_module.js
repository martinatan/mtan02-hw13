const MongoClient = require('mongodb').MongoClient;
const csvtojson = require("csvtojson");

exports.populateDB = function(url, dbName, collName, csvName) {
	console.log("welcome to the populateDB function!");

	//open CSV and convert to JSON object called csvData
	csvtojson().fromFile(csvName).then(csvData => {
		console.log(csvData);

		//connect to mongoDB
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err) {return console.log(err);}

			//get database
			var dbObj = db.db(dbName);

			//get collection
			var collObj = dbObj.collection(collName);
			//insert data into collection ONLY if it does not yet exist
			collObj.insertMany(csvData, (err, res) => {
				if(err) {return console.log(err);}
				console.log("Inserted rows");
				db.close();
			});

		});
	});
};

exports.searchDB = function(collObj, searchKey, searchVal) {
	console.log("welcome to the searchDB function!");

	//we are given a search term and the collection to search for it, the search Key and Value
	//we will return the full object the search returns
	//connect to mongoDB
	//within mongoDB, i'll use find
	// MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
	// 	if (err){return console.log(err);}

	// 	var dbObj = db.db(dbName);
	// 	var collObj = dbObj.collection(collName);

		//var query = { searchKey: searchVal };

	//});
};