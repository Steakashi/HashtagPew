# HashtagPew
Web application displaying tweets in real-time (from a given hashtag) that can be destroyed with a simple click.

Try to get them all and to get the best score ever !

## Requirements
To use HashtagPew, you will need to install [NodeJS](https://nodejs.org)

## Installation
**Clone the repository** or download it and extract it where you want.

**Go to the project** root and install all modules from package.json
```
cd HashtagPew
npm install
```
**Now, you need to configure a little bit the application.**
First, rename the file "auth_template.json" to auth.json" et fill the file with your own information.
```
mv app/config/auth_template.json app/config/auth.json
```
*If you don't know what are these informations or where to get them, [you should check this page.](https://dev.twitter.com/oauth/overview)*

**Then, open the file "hashtag.json" in "app/config" and fill it** with your own hashtag (According to the legend, "beer" and "pizza" are tweets that work pretty well)
```
nano app/config/hashtag.json
```
**Keep going, we're almost done !** Now you just have to run the server with Node.js.
```
node app.js
```
**Final move :** open your favorite browser and tap the following url.
```
http://localhost:8080/
```
Have fun. You stay classy, San Diego.