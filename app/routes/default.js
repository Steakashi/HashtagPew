var express = require('express'); // Require our express instance

module.exports = (function ()  
{
    var router = express.Router(); // Create a new router instance

    router.get('/*', function (req, res) // All urls
    {
        res.sendFile('./public/index.html'); // Send index.html
    })

    return router; // Return router instance to use in the require call inside server.js
})();