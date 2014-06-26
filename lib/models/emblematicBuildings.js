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
			query="SELECT L.ADDRESS, L.GEOM, T.TYPE_DENOM_ES, T.TYPE_DENOM_EN, T.TYPE_DENOM_EU, B.* FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L where L.ID=B.LOCATION_ID  AND T.ID=B.BUILDING_TYPE AND T.TYPE_DENOM_ES!='Museo'";
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
	},
	findByIdGeoJson: function(id, cb){
		pg.connect(conString, function(err,client, done){
			var query="SELECT row_to_json(f) \
				FROM (SELECT 'Feature' as type \
				, ST_AsGeoJSON(l.geom)::json As geometry \
				, row_to_json(lp) as properties \
				FROM location as l \
				INNER JOIN (SELECT b.* from EMBLEMATIC_BUILDING b, location l WHERE b.id=$1 and b.location_id=l.id) as lp ON lp.location_id=l.id)as f";
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Edificio no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0].row_to_json);
					}
				}
			});
		});
	},
	findByIdGeoJsonWithoutDetails: function(id, cb){
		pg.connect(conString, function(err,client, done){
			console.log("paso rpo aqui");
			var query="SELECT row_to_json(f) \
				FROM (SELECT 'Feature' as type \
				, ST_AsGeoJSON(l.geom)::json As geometry \
				, row_to_json(lp) as properties \
				FROM location as l \
				INNER JOIN (SELECT b.denom_es, b.denom_en, b.denom_eu,b.image_path, b.description_es, b.description_en, b.description_eu,b.location_id, b.building_type ,t.*\
				from EMBLEMATIC_BUILDING b, location l, building_type t WHERE t.id=b.building_type and b.id=$1 and b.location_id=l.id) as lp ON lp.location_id=l.id)as f";
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Edificio no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0].row_to_json);
					}
				}
			});
		});
	},
	findMuseums: function(cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT L.ADDRESS, L.GEOM, T.TYPE_DENOM_ES, T.TYPE_DENOM_EN, T.TYPE_DENOM_EU, B.* FROM EMBLEMATIC_BUILDING B, BUILDING_TYPE T, LOCATION L where L.ID=B.LOCATION_ID  AND T.ID=B.BUILDING_TYPE AND T.TYPE_DENOM_ES='Museo'";
			client.query(query, [], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún edificio museo en la base de datos"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	},
	findNoteById: function(id, cb){
		pg.connect(conString, function(err,client, done){
			var query="SELECT AVG(C.NOTE) FROM BUILDING_COMMENTS C, EMBLEMATIC_BUILDING B WHERE B.ID=C.BUILDING_ID AND B.ID=$1"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
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
	}
};