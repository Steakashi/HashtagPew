$(document).ready(function() {

    var container = document.getElementById('content');
    
    socket = io.connect('http://localhost:8080');
                    
    socket.on('twitter', function(data) {
    	
    	console.debug(data);
    	container.innerHTML = data.user.screen_name;
       
    });

});