var db= require('../models');

db
	.sequelize
	.sync({force: true})
	.comlete(function(err){
		if(err){
			throw err;
		}else{
			
		}
	});

