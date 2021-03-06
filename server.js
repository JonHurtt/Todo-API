var express = require('express'); //Require Express NPM Module
var bodyParser = require('body-parser');
var _ = require('underscore'); //use the underscore variable of "_"
console.log("Requring db.js");
var db = require('./db.js');
console.log("db.js Loaded");

var app =  express();
var PORT = process.env.PORT || 3000; //Used env.PORT for Heroku
var todos = [];
var todoNextID = 1;

/************************************/
//Setting up Middleware
/************************************/

app.use(bodyParser.json());//anytime a JSON request comes in, Express parses it and we can access it via bodyParser

/************************************/
//Get Root
/************************************/

app.get('/', function(request, response){
	console.log("GET <root>");
	response.send('To Do API Root');
});


/************************************/
//GET /todos?completed=true?q=house
/************************************/

app.get('/todos', function(request, response){
	console.log("GET /todos");
	var query = request.query;//will be a string
	var where = {};
	
	console.log("Query Paramaters");
	console.log(query);
	
	
	if(query.hasOwnProperty('completed') && query.completed == 'true'){
		where.completed = true;		
	}else if(query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;		
	}//endifelse
	
	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like: '%'+ query.q + '%'
		};
	}//end Query
	
	
	db.todo.findAll({where: where})
	.then(function(todos){
		console.log('Found Todos');			
		response.json(todos);
		
	}, function(error){
		console.log('Error Finding Todos');
		response.status(500).send();
		
	});
	/*
		var filteredTodos = todos;
	
	//Check to make sure Query has this property and then if its true
	if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true})
		
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false})		
	}//endifelse
	
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		//Check to see if descritpion contains queryParams.q
		filteredTodos = _.filter(filteredTodos, function(todo){
			//Check to see if indexOf finds q in.
			return 	todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;		
		})
	}//end Query

	//respond with filtered todos (which might not be filtered)
	response.json(filteredTodos);
	*/
});

/************************************/
//GET /todos/:id
/************************************/
app.get('/todos/:id', function(request, response){
	console.log("GET /todos/:id");
	//response.send('Asking for todo with id of ' + request.params.id);
	
	var todoID = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number
	
	db.todo.findById(todoID)
	.then(function(todo){
			if(!!todo){
				console.log('Found Todo');			
				response.json(todo.toJSON());
			}else{
				console.log('Error Finding Todo');
				response.status(404).send();
			}
	}, function(error){
		console.log('Error Finding Todo');
		response.status(500).send();
	})

	/*
	//Refactor using Underscore
	var matchedTodo = _.findWhere(todos, {id: todoID});
	
	if(typeof matchedTodo === 'undefined'){
		response.status(404).json({"error" : "No ToDo found with id of " + todoID + ". Cannot GET"});
	}else{
		response.json(matchedTodo);
	}	
	*/
	
});

/************************************/
// POST  /todos
/************************************/
app.post('/todos', function(request, response){
	console.log('POST /todos');
	//Save Body and reomve unwanted keys
	var body = _.pick(request.body, 'id', 'description', 'completed')

	db.todo.create(body)
	.then(function (todo){
		console.log('Created Todo');
		response.json(todo.toJSON());
	}, function (error){
		console.log('Error Creating Todo');
		response.status(400).json(error);
	});
	
	
	/*
	//Validation for String or Boolean or Empty String and sanitize string
	if(!_.isString(body.description) ||  !_.isBoolean(body.completed) || (body.description.trim().length === 0)){
		response.status(404).send("Error 404");
	}else{
		body.id = todoNextID++;
		body.description = body.description.trim();
		todos.push(body);
		response.json(body);	
	}
	*/
});

/************************************/
//Delete /todos/:id
/************************************/
app.delete('/todos/:id', function(request, response){
	console.log("DELETE /todos/:id");
	var todoId = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number

	console.log("Destroying Todo");
	db.todo.destroy({
		where: {
			id: todoId
		}
	})
	.then(function(rowsDeleted){
			if(rowsDeleted === 0){
				console.log('Error Finding Todo');
				response.status(404).send();
			}else{
				console.log('Found Todo');			
				response.status(204).send()

			}
	}, function(error){
		console.log('Error Finding Todo');
		response.status(500).send();
	})

		
	/*
	//Refactor using Underscore
	var matchedTodo = _.findWhere(todos, {id: todoID});
	
	if(typeof matchedTodo === 'undefined'){
		response.status(404).json({"error:" : "No ToDo found with id of " + todoID + ". Cannot DELETE"});
	}else{
		todos = _.without(todos, matchedTodo);
		response.json(matchedTodo);
	}
	*/
		
});

/************************************/
//PUT /todos/:id
/************************************/
app.put('/todos/:id', function(request, response){
	console.log("PUT /todos/:id");
	var todoId = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number
	
	//var matchedTodo = _.findWhere(todos, {id: todoID});

	//Save Body and reomve unwanted keys
	var body = _.pick(request.body, 'description', 'completed')
	//var validAttributes = {};
	var attributes = {};

	/*if(!matchedTodo){
		return response.status(404).json({"error:" : "No ToDo found with id of " + todoID + ". Cannot PUT"});
	}
	*/

	//Validate Properties
	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return response.status(404).json({"error:" : "Unable to Update completed with id of " + todoId + ". Cannot PUT"});
	}
	
	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	}	
	
	//Using an Instance Method vs Model Method
	db.todo.findById(todoId)
	.then( function(todo){
		if(todo){
			console.log("Todo Found - Now Updating...")			
			todo.update(attributes)
			.then(function(todo) {
				console.log("Success with Updating Todo...")			
				response.json(todo.toJSON());
		}, function(error){
			console.log("Error Updating Todo...")
			response.status(400).json(error);
	});
		}else{
			console.log("Todo Not Found - Not able to Update...")			
			response.status(404).send();
		}
	}, function(error){
		console.log("Error Finding Todo Not...")			
		response.status(500).send()		
	});
			
		
	/*
	//Validate Properties
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return response.status(404).json({"error:" : "Unable to Update completed with id of " + todoID + ". Cannot PUT"});
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && (body.description.trim().length() > 0)){
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return response.status(404).json({"error:" : "Unable to Update description with id of " + todoID + ". Cannot PUT"});
	}
	
	
	_.extend(matchedTodo, validAttributes); //extend already updates matchedToDO no need to assign it
	response.json(matchedTodo);
	*/

	
});

/************************************/
//Sync DB and then start Web Server
/************************************/
db.sequelize.sync()
.then(function(){
	app.listen(PORT, function(){
		console.log('Webserver listing on '+ PORT + '!')
		
	});	
});



