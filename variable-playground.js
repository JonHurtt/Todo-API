/*
	You can pass Arrays & Objects by Reference
	Other data types (bool, # and string) must use Return
*/

var person = {
	name: 'Andrew',
	age: 21
}

function updatePerson(obj){
	/*
		This wont update the original object and create a new one
		obj = {
		name: 'Andrew',
		age: 24
	}
	*/
	
	//This would update the original object
	obj.age = 24;
	
}
console.log('Before Update: ' + person.age)
updatePerson(person);
console.log('After Update: ' + person.age)

var grades = [90,100];

function addGrade(array){

	array.push('88')
	debugger;
	//array = [12,33,99] //This will not add but create new object and never save
}

console.log(grades)
addGrade(grades);
console.log(grades)
