var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
getSubwayLines: function(cb){
    pg.connect(conString,function(err,client,done){
      var query="SELECT row_to_json(fc) \
      FROM (SELECT 'FeatureCollection' as type, array_to_json(array_agg(f)) As features \
      FROM (SELECT 'Feature' as type \
        , ST_AsGeoJSON(lg.way)::json As geometry \
        , row_to_json(lp) as properties \
        FROM planet_osm_line as lg \
        INNER JOIN (SELECT osm_id from planet_osm_line l WHERE railway='subway') as lp ON lg.osm_id=lp.osm_id)as f)as fc";
        client.query(query, function(err, result){
        if(err){
          console.log(err);
          done();
          cb(err,null);
        }else{
          console.log(result.rows[0]);
          done();
          cb(null, result.rows);
        }
      });
    });
  },
  getSubwayEntrances: function(cb){
    pg.connect(conString, function(err,client, done){
      var query="SELECT row_to_json(fc) \
      FROM (SELECT 'FeatureCollection' as type, array_to_json(array_agg(f)) As features \
      FROM (SELECT 'Feature' as type \
      , ST_AsGeoJSON(lg.way)::json As geometry \
      , row_to_json(lp) as properties \
      FROM planet_osm_point as lg \
      INNER JOIN (SELECT osm_id from planet_osm_point l WHERE railway='subway_entrance') as lp ON lg.osm_id=lp.osm_id)as f)as fc"
      client.query(query, function(err, result){
        if(err){
          console.log(err);
          done();
          cb(err,null);
        }else{
          console.log(result.rows);
          done();
          cb(null, result.rows);
        }
      });
    });
  },
  getTramLines: function(cb){
    pg.connect(conString,function(err,client,done){
      var query="SELECT row_to_json(fc) \
      FROM (SELECT 'FeatureCollection' as type, array_to_json(array_agg(f)) As features \
      FROM (SELECT 'Feature' as type \
        , ST_AsGeoJSON(lg.way)::json As geometry \
        , row_to_json(lp) as properties \
        FROM planet_osm_line as lg \
        INNER JOIN (SELECT osm_id from planet_osm_line l WHERE railway='tram') as lp ON lg.osm_id=lp.osm_id)as f)as fc";
        client.query(query, function(err, result){
        if(err){
          console.log(err);
          done();
          cb(err,null);
        }else{
          console.log(result.rows);
          cb(null, result.rows);
        }
      });
    });
  },
  getTramStops: function(cb){
    pg.connect(conString, function(err,client, done){
      var query="SELECT row_to_json(fc) \
      FROM (SELECT 'FeatureCollection' as type, array_to_json(array_agg(f)) As features \
      FROM (SELECT 'Feature' as type \
      , ST_AsGeoJSON(lg.way)::json As geometry \
      , row_to_json(lp) as properties \
      FROM planet_osm_point as lg \
      INNER JOIN (SELECT osm_id from planet_osm_point l WHERE railway='tram_stop') as lp ON lg.osm_id=lp.osm_id)as f)as fc"
      client.query(query, function(err, result){
        if(err){
          console.log(err);
          done();
          cb(err,null);
        }else{
          console.log(result.rows);
          cb(null, result.rows);
        }
      });
    });
  }
}