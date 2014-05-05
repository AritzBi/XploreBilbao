var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query='SELECT L.ADDRESS, L.GEOM, T.TYPE_DENOM_ES, T.TYPE_DENOM_EN, T.TYPE_DENOM_EU, B.*, (SELECT AVG(C.NOTE) FROM BUILDING_COMMENTS C, EMBLEMATIC_BUILDING B WHERE B.ID=C.BUILDING_ID AND B.ID=$1) AS "NOTE" FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L WHERE B.ID=$1 AND L.ID=B.LOCATION_ID AND T.ID=B.BUILDING_TYPE ';
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
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
			query="SELECT L.ADDRESS, L.GEOM, T.TYPE_DENOM_ES, T.TYPE_DENOM_EN, T.TYPE_DENOM_EU, B.* FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L where L.ID=B.LOCATION_ID  AND T.ID=B.BUILDING_TYPE";
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