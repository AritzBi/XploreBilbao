var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query='SELECT * FROM EVENT E,EVENT_LOCATION EL, LOCATION L, EVENT_TYPE ET, EVENT_SUBTYPE ES WHERE E.ID=$1 AND L.ID=EL.LOCATION_ID AND E.ID=EL.EVENT_ID AND E.TYPE_ID=ES.ID AND ES.TYPE_ID=ET.ID ';
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Evento no encontrado"),null);
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
			query="SELECT * FROM EVENT E,EVENT_LOCATION EL, LOCATION L, EVENT_TYPE ET, EVENT_SUBTYPE ES WHERE L.ID=EL.LOCATION_ID AND E.ID=EL.EVENT_ID AND E.TYPE_ID=ES.ID AND ES.TYPE_ID=ET.ID ";
			client.query(query, [], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún evento en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	},
	getEventsByType: function(id,cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM EVENT E,EVENT_LOCATION EL, LOCATION L, EVENT_TYPE ET, EVENT_SUBTYPE ES WHERE L.ID=EL.LOCATION_ID AND E.ID=EL.EVENT_ID AND E.TYPE_ID=ES.ID AND ES.TYPE_ID=ET.ID AND ET.ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún evento en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	}
};