var express = require('express');
var app =  express();
var PORT = process.env.PORT || 3000; //Used env.PORT for Heroku

app.get('/', function(request, response){
	response.send('To Do API Root');
});

app.listen(PORT, function(){
	console.log('Webserver listing on '+ PORT + '!')
	
});
