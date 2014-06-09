var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM EVENT_TYPE ET, EVENT_SUBTYPE ES  WHERE ES.ID=$1 AND ES.TYPE_ID=ET.ID";
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Categoria de eventos no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0]);
					}
				}
			});

		});
	},
	findAll: function(cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM EVENT_TYPE ET, EVENT_SUBTYPE ES  WHERE  ES.TYPE_ID=ET.ID";
			client.query(query, [], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ninguna categoría de eventos en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	},	
	findMainCategories: function(cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM EVENT_TYPE";
			client.query(query, [], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ninguna categoría de eventos en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	},	
	findSubCategories: function(id,cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM EVENT_TYPE T, EVENT_SUBTYPE S where T.ID=$1 AND T.ID=S.TYPE_ID";
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ninguna categoría de eventos en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	}
};