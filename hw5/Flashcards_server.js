"use strict"
const APIrequest = require('request');
const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const port = 50228; // you need to put your port number here

const http = require('http');

const APIkey = "AIzaSyDK6ZgY0sJYWsXLgSqUHT3EK_b6TDV2XjQ";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
const db = new sqlite3.Database('Flashcards.db');

// function to handle query when getting a "translate" request
function queryHandler(req, res, next) {
	let url = req.url;
	let qObj = req.query;
	console.log(qObj);
	let requestObject =
	{
		"source": "en",
		"target": "zh-CN",
		"q": [
			qObj.english
		]
	};

	translate(res, requestObject);

	if (res == undefined) {
		next();
	}
}

//actual function handle the query and the callback function
function translate(res, requestObject) {
	//send the request
	APIrequest(
		{
			url: url,
			method: "POST",
			headers: { "content-type": "application/json" },
			json: requestObject
		},
		APIcallback
	);
	//callback handling the response
	function APIcallback(err, APIresHead, APIresBody) {
		if ((err) || (APIresHead.statusCode != 200)) {
			// API is not working
			console.log("Got API error");
			console.log(APIresBody);
		}
		else {
			if (APIresHead.error) {
				// API worked but is not giving you data
				console.log(APIresHead.error);
			}
			else {
				let str = APIresBody.data.translations[0].translatedText;
				res.json(str);
				console.log("\n\nJSON was:");
				console.log(JSON.stringify(APIresBody, undefined, 2));
			}
		}
	}
}

function dbhandler(req,res,next) {
	let url = req.url;
	let qObj = req.query;
	console.log(qObj);
	let eng = qObj.english;
	let chn = qObj.chinese;
	const cmdStr = 'INSERT into Flashcards (user,english,chinese,seen,correct) VALUES (1,@0,@1,0,0)';
	db.run(cmdStr,eng,chn,insertCallback);
	function insertCallback(err) {
		if (err) {console.log(err);}
		else {console.log("saved");}
		/*db.close();*/
	}
}

function fileNotFound(req, res) {
	let url = req.url;
	res.type('text/plain');
	res.status(404);
	res.send('Cannot find ' + url);
}

// put together the server pipeline
const app = express();
app.use(express.static('public'));  // can I find a static file? 
app.get('/translate', queryHandler);   // query for translation 
app.get('/store', dbhandler);		// query for storing card
app.use(fileNotFound);            // otherwise not found

app.listen(port, function () { console.log('Listening...'); });