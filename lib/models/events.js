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
			query="SELECT to_char(e.startdate,'YYYY-MM-DD') as sDate,to_char(e.endate,'YYYY-MM-DD') as eDate,* FROM EVENT E,EVENT_LOCATION EL, LOCATION L, EVENT_TYPE ET, EVENT_SUBTYPE ES WHERE L.ID=EL.LOCATION_ID AND E.ID=EL.EVENT_ID AND E.TYPE_ID=ES.ID AND ES.TYPE_ID=ET.ID AND ET.ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay ningún evento en la base de datos"),null);
					}else{
						done();
						console.log(result.rows);
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
				INNER JOIN (SELECT e.*,el.denom,el.location_id, et.type_es,et.type_en,et.type_eu,es.subtype_es,es.subtype_en,es.subtype_eu \
				from event e, location l, event_location el, event_type et, event_subtype es \
				WHERE e.id=$1 and el.location_id=l.id and el.event_id=e.id and es.type_id=et.id and e.type_id=es.id) as lp ON lp.location_id=l.id)as f"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					console.log(err);
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Evento no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0].row_to_json);
					}
				}
			});
		});
	},
	findByIdGeoJsonWithoutDetails: function(id, cb){
		console.log("llamo aquiasdhaisdhasj");
		console.log(id);
		pg.connect(conString, function(err,client, done){
			var query="SELECT row_to_json(f) \
				FROM (SELECT 'Feature' as type \
				, ST_AsGeoJSON(l.geom)::json As geometry \
				, row_to_json(lp) as properties \
				FROM location as l \
				INNER JOIN (SELECT e.title_es, e.title_en, e.title_eu,e.description_es, e.image_path,e.description_en, e.description_eu,el.location_id, \
				et.type_es,et.type_en,et.type_eu,es.subtype_es,es.subtype_en,es.subtype_eu \
				from event e, location l, event_location el, event_type et, event_subtype es \
				WHERE  e.id=$1 and el.location_id=l.id and el.event_id=e.id and es.type_id=et.id and e.type_id=es.id) \
				as lp ON lp.location_id=l.id)as f"
			client.query(query, [id], function(err,result){
				done();
				if(err){
					console.log(err);
					cb(err,null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Evento no encontrado"),null);
					}else{
						done();
						cb(null, result.rows[0].row_to_json);
					}
				}
			});
		});
	}
};