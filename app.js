var Twitter = require('twitter');
var fs = require('fs');

// Read the data from the authentification file
var authFile = fs.readFileSync("config/auth.json");
var authParam = JSON.parse(authFile);

// Create the Twitter Object
var twittObject = new Twitter({
	consumer_key: authParam.consumer_key,
	consumer_secret: authParam.consumer_secret,
	access_token_key: authParam.access_token_key,
	access_token_secret: authParam.access_token_secret
});