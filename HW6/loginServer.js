"use strict"

const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');
const sqlite = require('sqlite3');
const sqlite3 = require("sqlite3").verbose();
const APIrequest = require('request');
const port = 50228; // you need to put your port number here
const http = require('http');

const APIkey = "AIzaSyDK6ZgY0sJYWsXLgSqUHT3EK_b6TDV2XjQ";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
const db = new sqlite3.Database('Flashcards.db');


// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
    clientID: '519493548390-fejklek17ki3pm37u1j4tstk5cdk2g7l.apps.googleusercontent.com',
    clientSecret: '2wNsflXWDLmzdAV8kPrXiT4O',
    callbackURL: '/auth/redirect'
};

// Strategy configuration. 
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );


// Let's build a server pipeline!
// app is the object that implements the express server
const app = express();
// middleware functions

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
    if (req.user) {
	console.log("Req.session:",req.session);
	console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/login.html');  // send response telling
	// Browser to go to login page
    }
}

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
	let googleID=profile.id;
	let first=profile.name.givenName;
	let last=profile.name.familyName;
    let dbRowID = googleID;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
	// True.  
	const checkStr = "SELECT 1 FROM Users WHERE googleID=" + googleID;
	db.get(checkStr, callbackvalue);

	function callbackvalue(err,data) {
		console.log(data);
		if (err) {console.log("error: ", err);}
		if (!data) {
			const cmdStr = 'INSERT into Users (googleID, first, last) VALUES (@0,@1,@2)';
			db.run(cmdStr,googleID,first,last, insertCallback);
		}else { 
			console.log("already existed");
		}
	}
	
	function insertCallback(err) {
		if (err) { console.log(err); }
		else { console.log("saved"); }
	}

    done(null, dbRowID); 
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: dbRowID};
    done(null, userData);
});


/*******************************************************************************************/
/*********************************      translate   ******************************************/
/*******************************************************************************************/
// function to handle query when getting a "translate" request
function queryHandler(req, res, next) {
	let queryHandlerUrl = req.url;
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
	let dbhandlerUrl = req.url;
	let user = req.user.userData;
	console.log(user);
	let qObj = req.query;
	console.log(qObj);
	let eng = qObj.english;
	let chn = qObj.chinese;
	const cmdStr = 'INSERT into Flashcards (user,english,chinese,seen,correct) VALUES (@0,@1,@2,0,0)';
	db.run(cmdStr,user,eng,chn,insertCallback);
	function insertCallback(err) {
		if (err) {console.log(err);}
		else {console.log("saved");}
		/*db.close();*/
	}
}

function userhandler(req, res, next) {
	console.log(req.user.userData);
	const cmdstr = "SELECT First, Last FROM Users WHERE googleID=" + req.user.userData;
	db.get(cmdstr,callbackuser);

	function callbackuser(err,data) {
		if (err) {console.log("error: ",err);}
		console.log(data);
		res.send(data);
	}
}
function cardhandler(req,res,next) {
	let user = req.user.userData;
	//select * from Flashcards where user = 116924358072613295906 order by seen limit 1
	const cmdstr = "SELECT english, chinese, seen, correct FROM Flashcards WHERE user = " 
	+ user + " ORDER BY random()";
	//(max(1,5-correct) + max(1,5-seen) + 5*( (seen-correct)/seen)) LIMIT 1";
	db.get(cmdstr,callbackcard);

	let dumpy = true;
	function callbackcard(err,data, dumpy) {
		if (err) {console.log("error: ", err);}
		console.log(data);
		res.send(data);
	}
}

function dbupdater(req,res,next) {
	let englishanswer= req.query.answer;
	let corrected=req.query.corrected;
	let user = req.user.userData;
	if (corrected==1) {
	const cmdStr = "UPDATE Flashcards SET seen = seen + 1, correct = correct + 1 WHERE user = " + user + " AND english = \"" + englishanswer + "\"";
	db.run(cmdStr,callbackupdater);
	}
	else {
		const cmdStr = "UPDATE Flashcards SET seen = seen + 1 WHERE user = " + user + " AND english = \"" + englishanswer + "\"";
		db.run(cmdStr,callbackupdater);
	}

	function callbackupdater(err) {
		if (err) {console.log("error: ", err);}
		else {console.log("DB Updated!");}
	}

}
// function for end of server pipeline
function fileNotFound(req, res) {
	let NotFoundUrl = req.url;
	console.log(NotFoundUrl);
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+NotFoundUrl);
    }

// put together the server pipeline
// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']  
}));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session()); 

// Public static files
app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other. 
app.get('/auth/redirect',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/redirect");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
	    console.log('Logged in and using cookies!')
	    res.redirect('/lango.html');
	});

// static files in /user are only available after login
app.get('/user/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('.') 
       ); 
// next, all queries (like translate or store or get...
//app.get('/query', function (req, res) { res.send('HTTP query!') });
app.get('/translate', queryHandler);   // query for translation 
app.get('/store', dbhandler);		// query for storing card
app.get('/database', userhandler);
app.get('/givemeacard', cardhandler);
app.get("/updatedb", dbupdater);
// finally, not found...applies to everything
app.use( fileNotFound );

// Pipeline is ready. Start listening!  
app.listen(50228, function (){console.log('Listening...');} );