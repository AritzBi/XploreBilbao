var pg=require('pg');
var config = require('../config/config');
module.exports = {
	findById: function(id, cb){
		pg.connect(config.bdPath, function(err,client,done){
			query="SELECT T.* FROM HOSTELERY_TYPE T WHERE T.ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Categoria de hosteleria no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0]);
					}
				}
			});

		});
	},
	findAll: function(type, cb){
		pg.connect(config.bdPath, function(err,client,done){
			query="SELECT T.* FROM HOSTELERY_TYPE T where T.SECOND_TYPE_ES=$1";
			client.query(query, [type], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ninguna categoría de hosteleria en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	}
};