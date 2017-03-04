// Initialize required modules
var express = require('express');
var path    = require("path");

// Send html file to our view
module.exports = (function ()  
{
    var router = express.Router();

    router.get('/*', function (req, res) // All urls
    {
 		res.sendFile(path.join(__dirname+'/../../public/index.html'));
    })

    return router;
})();