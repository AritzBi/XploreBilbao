var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT L.ADDRESS, L.GEOM, T.DENOM_ES, T.DENOM_EN, T.DENOM_EU, B.* FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L WHERE H.ID=$1 AND L.ID=H.LOCATION_ID AND T.ID=B.BUILDING_TYPE ";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Edificio no encontrado"),null);
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
			query="SELECT L.ADDRESS, L.GEOM, T.DENOM_ES, T.DENOM_EN, T.DENOM_EU, B.* FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L where L.ID=H.LOCATION_ID  AND T.ID=B.BUILDING_TYPE";
			client.query(query, [], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún edificio emblematico en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	}
};