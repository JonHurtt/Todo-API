//initialize the Sequelize
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect' : 'sqlite',
	'storage' : __dirname + '/data/dev-todo-api.sqlite'
});


//Create Database Object
var db = {};
//load in Sequelize from other files
console.log('Begin Loading Models');
db.todo = sequelize.import(__dirname + '/models/todo.js');
console.log("Completed Loading Models");

db.sequelize = sequelize; //Seququlize Object
db.Sequelize = Sequelize; //Sequelize Library

//Return the DB Object when exporting
module.exports = db;

