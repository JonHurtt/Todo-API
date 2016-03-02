var express = require('express'); //Require Express NPM Module
var app =  express();
var PORT = process.env.PORT || 3000; //Used env.PORT for Heroku
var todos = [{
	id: 1, //uniqueID
	description: 'Meet mom for lunch',
	completed: false
},{
	id: 2,
	description: 'Go to Market',
	completed: false
},{
	id: 3,
	description: 'Feed the Dog',
	completed: true
}];

app.get('/', function(request, response){
	response.send('To Do API Root');
});

//GET /todos
app.get('/todos', function(request, response){
	response.json(todos);
	
})


//GET /todos/:id
app.get('/todos/:id', function(request, response){
	//response.send('Asking for todo with id of ' + request.params.id);
	
	var todoID = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number
	var matchedTodo;
	
	todos.forEach(function(todo){
		console.log('Looking for ID: ' + todoID)
		if(todoID === todo.id){
			console.log('Found ID: ' + todoID)
			matchedTodo = todo;
		}
	});
		
	if(typeof matchedTodo === 'undefined'){
		response.status(404).send();
	}else{
		response.json(matchedTodo);
	}
	
});


app.listen(PORT, function(){
	console.log('Webserver listing on '+ PORT + '!')
	
});
