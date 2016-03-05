/*var S1 = require('sequelize');
var s2 = new S1(undefined, undefined, undefined, {
	'dialect' : 'sqlite',
	'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = s2.define('todo', {
	description: {
		type: S1.STRING
	},
	completed: {
		type: S1.BOOLEAN
	}
})

s2.sync().then(function(){
	console.log('Everything is Synced');
});*/



var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect' : 'sqlite',
	'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false, //can't be null
		validate: {
			len: [1, 256] //only take strings that are 1 or greater than 1 and less or equal than 256
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false		
	}
})


//Takes Models and creates DB based on model
//sequelize.sync({force:true}).then(function() { ///forces DB wipe
sequelize.sync().then(function() {	
	console.log("Everything is synced!")
	
	//fetch Todo by ID
	//If you find print using toJSON
	//Error Todo Not found
	
	Todo.findById(1)
	.then(function(todo){
			if(todo){
				console.log(todo.toJSON());
			}else{
				throw new Error('Unable to find Todo');
			}
	})
	.catch(function(error){
		console.log('***Error****');
		console.log(error)
	})

/*
//Creating a entry in DB
	Todo.create({
		description: 'Take out trash',
		//completed: false
	}).then(function(todo){
		console.log('Finished!');
		//console.log(todo);
		return Todo.create({
			description: 'Clean office'
		}).then(function(){
			//return Todo.findById(1)
			return Todo.findAll({
				where: {
					description: {
						$like: '%Office%'
					}
				}
			})
		}).then(function(todos){
			if(todos){
				todos.forEach(function (todo){
					console.log(todo.toJSON());
				});
			}else{
				console.log('No Todos Found')
			}
		});
	}).catch(function (error){
		console.log(error);
	});
*/
});//end then

