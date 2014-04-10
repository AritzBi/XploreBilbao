module.exports=function(sequelize, DataTypes){
	var Member=sequelize.define('Member',{
		//email, username, salt, hash, name, surnarme
		email: DataTypes.STRING,
		username: DataTypes.STRING,
		salt: DataTypes.STRING,
		hash: DataTypes.STRING,
		name: DataTypes.STRING,
		surnarme: DataTypes.STRING
	},{freezeTableName: true});
	return Member;
};