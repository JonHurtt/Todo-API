var express = require('express'); //Require Express NPM Module
var bodyParser = require('body-parser');

var app =  express();
var PORT = process.env.PORT || 3000; //Used env.PORT for Heroku
var todos = [];
var todoNextID = 1;

//Setting up Middleware
app.use(bodyParser.json());//anytime a JSON request comes in, Express parses it and we can access it via bodyParser

app.get('/', function(request, response){
	response.send('To Do API Root');
});

//GET /todos
app.get('/todos', function(request, response){
	response.json(todos);	
});


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


// POST  /todos
app.post('/todos', function(request, response){
	console.log('POST /todos');
	var body = request.body;

	console.log('Description: ' + body.description);

	/*	
	var newTodo = {
		id: todoNextID,
		description: body.description,
		completed: body.completed
	}
	todoNextID++;
	todos.push(newTodo);
	*/

	body.id = todoNextID++
	todos.push(body);
	response.json(body);	
});



app.listen(PORT, function(){
	console.log('Webserver listing on '+ PORT + '!')
	
});
