
module.exports = function(sequelize, DataTypes){
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false, //can't be null
			validate: {
				len: [1, 256] //only take strings that are 1 or greater than 1 and less or equal than 256
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false		
		}
	})
	
}

