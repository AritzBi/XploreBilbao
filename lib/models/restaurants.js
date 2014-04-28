var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT L.ADDRESS, L.GEOM, T.FIRST_TYPE_ES, T.SECOND_TYPE_ES, H.* FROM HOSTELERY H,HOSTELERY_TYPE T, LOCATION L WHERE H.ID=$1 AND L.ID=H.LOCATION_ID AND T.ID=H.HOSTELERY_TYPE ";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Restaurante no encontrado"),null);
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
			query="SELECT L.ADDRESS, L.GEOM, T.FIRST_TYPE_ES, T.SECOND_TYPE_ES, H.* FROM HOSTELERY H,HOSTELERY_TYPE T, LOCATION L where T.SECOND_TYPE_ES='Restaurante' AND L.ID=H.LOCATION_ID  AND T.ID=H.HOSTELERY_TYPE";
			client.query(query, [], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún restaurante en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	}
};