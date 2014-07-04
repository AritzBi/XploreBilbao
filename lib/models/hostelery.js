var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findById: function(id,cb){
		pg.connect(conString, function(err,client,done){
			query='SELECT L.ADDRESS, L.GEOM, T.FIRST_TYPE_ES, T.SECOND_TYPE_ES, H.*, (SELECT AVG(C.NOTE) FROM HOSTELERY_COMMENTS C, HOSTELERY H WHERE H.ID=C.HOSTELERY_ID AND H.ID=$1) AS "NOTE" FROM HOSTELERY H,HOSTELERY_TYPE T, LOCATION L WHERE H.ID=$1 AND L.ID=H.LOCATION_ID AND T.ID=H.HOSTELERY_TYPE ';
			client.query(query, [id], function(err,result){
				if(err){
					console.log(err);
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Establecimiento no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0]);
					}
				}
			});

		});
	},
	findAll: function(type, cb){
		pg.connect(conString, function(err,client,done){
			query='SELECT L.ADDRESS, L.GEOM, T.FIRST_TYPE_ES, T.SECOND_TYPE_ES,T.FIRST_TYPE_EN, T.SECOND_TYPE_EN,T.FIRST_TYPE_EU, T.SECOND_TYPE_EU, H.*,(SELECT AVG(C.NOTE) FROM HOSTELERY_COMMENTS C, HOSTELERY J WHERE J.ID=C.HOSTELERY_ID AND J.ID=H.ID) AS "note" FROM HOSTELERY H,HOSTELERY_TYPE T, LOCATION L where T.SECOND_TYPE_ES=$1 AND L.ID=H.LOCATION_ID  AND T.ID=H.HOSTELERY_TYPE';
			client.query(query, [type], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún establecimiento en la base de datos"),null);
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
				INNER JOIN (SELECT h.*, T.FIRST_TYPE_ES, T.SECOND_TYPE_ES,T.FIRST_TYPE_EN, T.SECOND_TYPE_EN,T.FIRST_TYPE_EU, T.SECOND_TYPE_EU from hostelery h, location l, hostelery_type t WHERE t.id=h.hostelery_type and h.id=$1 and h.location_id=l.id) as lp ON lp.location_id=l.id)as f"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Establecimiento no encontrado"),null);
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
			var query="SELECT row_to_json(f) \
				FROM (SELECT 'Feature' as type \
				, ST_AsGeoJSON(l.geom)::json As geometry \
				, row_to_json(lp) as properties \
				FROM location as l \
				INNER JOIN (SELECT h.denom_es, h.denom_en, h.denom_eu, h.description_es, h.description_en, h.description_eu,h.location_id,h.image_path, t.* \
				from hostelery h, location l, hostelery_type t WHERE  t.id=h.hostelery_type and h.id=$1 and h.location_id=l.id) as lp ON lp.location_id=l.id)as f"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Establecimiento no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0].row_to_json);
					}
				}
			});
		});
	},
	findNoteById: function(id, cb){
		pg.connect(conString, function(err,client, done){
			var query="SELECT AVG(C.NOTE) FROM HOSTELERY_COMMENTS C, HOSTELERY H WHERE H.ID=C.HOSTELERY_ID AND H.ID=$1"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Establecimiento no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0]);
					}
				}
			});
		});
	}
};