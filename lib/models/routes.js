var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
getInfoRouteById: function(id, cb){
  pg.connect(conString,function(err,client,done){
    var query="SELECT * FROM ROUTE WHERE ID=$1";
    client.query(query, [id], function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
createRoute: function(values,userId, cb){
    pg.connect(conString,function(err, client, done){
      var query="INSERT INTO ROUTE (name_es, name_en, name_eu, description_es, description_en, description_eu, ROUTE, createdby, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning ID";
      client.query(query,[values.name,values.name,values.name,values.description,values.description,values.description,values.route, userId, new Date()], function(err, result){
        if(err){
          done();
          cb(err,null);
        }else{
          done();
          cb(null, result);        
        }
      })
    });
},
followRoute: function(id,userId, cb){
  pg.connect(conString,function(err, client, done){
    var query="INSERT INTO USER_ROUTE (USER_ID,ROUTE_ID) VALUES ($1,$2)";
        client.query(query,[userId,id], function(err,result){
          if(err){
            done();
            cb(err, null);
          }else{
            done();
            cb(null, result);
          }
        });
  });
},
getInfoRoutes: function(cb){
  pg.connect(conString,function(err,client,done){
    var query="SELECT * FROM ROUTE ";
    client.query(query, function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
getInfoRouteByCode: function(code, cb){
  pg.connect(conString,function(err,client,done){
    var query="SELECT * FROM ROUTE where route_code=$1 ";
    client.query(query,[code], function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
getFollowingRoutes: function(userId, cb){
  pg.connect(conString,function(err,client,done){
    var query="SELECT R.ROUTE_ID FROM USER_ROUTE R, MEMBER M where m.id=$1 and m.id=r.user_id";
    client.query(query,[userId], function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
unfollowRoute: function(userId,routeId,cb){
  pg.connect(conString,function(err,client,done){
    var query="DELETE  FROM USER_ROUTE R  where r.user_id=$1 and r.route_id=$2";
    client.query(query,[userId,routeId], function(err,result){
      done();
      if(err){
        cb(err);
      }else{
        cb(null);
      }
    });
  });
},
getTopRoutes: function(cb){
  pg.connect(conString, function(err, client, done){
    var query="SELECT R.*, (SELECT AVG(U.NOTE) FROM USER_ROUTE U, ROUTE O WHERE O.ID=U.ROUTE_ID AND O.ID=R.ID) AS note FROM ROUTE R ORDER BY note ASC limit 10";
    client.query(query, function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
getMyRoutes: function(id, cb){
  pg.connect(conString, function(err, client, done){
    var query="SELECT R.* FROM ROUTE R, USER_ROUTE U where (r.createdby=$1 and u.user_id=r.createdby) or (u.user_id=$1 and u.route_id=r.id)";
    client.query(query, [id], function(err,result){
      done();
      if(err){
        cb(err,null);
      }else{
        cb(null, result.rows);
      }
    });
  });
},
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
          done();
          cb(err,null);
        }else{
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
          done();
          cb(err,null);
        }else{
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
          done();
          cb(err,null);
        }else{
          done();
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
          done();
          cb(err,null);
        }else{
          done();
          cb(null, result.rows);
        }
      });
    });
  },
  getWalkRoute: function(idSourceLocation, idTargetLocation, cb){
    pg.connect(conString, function(err, client, done){
      var totalDistance=0;
      var answer={};
      var sourceSource, sourceSourceDistancia, sourceSourceGeom;
      var targetSource, targetSourceDistancia, targetSourceGeom;
      var sourceTarget, sourceTargetDistancia, sourceTargetGeom;
      var targetTarget, targetTargetDistancia, targetTargetGeom;

      var geojson={ "type": "FeatureCollection",
                  "features": []
      };
      //Pedir el source más cercano al origen--Distance units un planar degrees
      var query = "SELECT vias.source, \
                      ST_DISTANCE( locations.geom::geography, ST_SETSRID( ST_MAKEPOINT( vias.x1 , vias.y1 ) , 4326 )::geography ) AS dist, \
                      ST_AsGeoJSON( ST_MAKELINE( ST_CLOSESTPOINT(  locations.geom , vias.the_geom ) , ST_SETSRID( ST_MAKEPOINT( vias.x1 , vias.y1 ) , 4326 ) ) ) AS geometria \
                      FROM \
                      location AS locations, ways AS vias \
                      WHERE \
                      locations.id = " + idSourceLocation + "\
                      AND ST_BUFFER(  locations.geom::geography , 100)::geometry && vias.the_geom \
                      ORDER BY dist ASC \
                      LIMIT 1";
      client.query(query, [], function(err, result){
        done();
        if(err){
          cb(err,null);
        }else{
          for(var i=0; i<result.rows.lenght;i++){
            sourceSource = result.rows[i].source;
            sourceSourceDistancia = result.rows[i].dist;
            sourceSourceGeom = JSON.parse(result.rows[i].geometria);
          }
          //Pedir el target más cercano al source
          query= "SELECT vias.target, \
                      ST_DISTANCE( locations.geom::geography, ST_SETSRID( ST_MAKEPOINT( vias.x2 , vias.y2 ) , 4326 )::geography ) AS dist, \
                      ST_AsGeoJSON( ST_MAKELINE( ST_CLOSESTPOINT( locations.geom, vias.the_geom ) , ST_SETSRID( ST_MAKEPOINT( vias.x2 , vias.y2 ) , 4326 ) ) ) AS geometria \
                      FROM \
                      location AS locations, ways AS vias \
                      WHERE \
                      locations.id = " + idSourceLocation + " \
                      AND ST_BUFFER(locations.geom::geography , 100)::geometry && vias.the_geom \
                      ORDER BY dist ASC \
                      LIMIT 1";
          client.query(query,[], function(err,result){
            done();
            if(err){
              cb(err,null);
            }else{
              for (var i = 0; i < result.rows.length; i++){
                targetSource = result.rows[i].target;
                targetSourceDistancia = result.rows[i].dist;
                targetSourceGeom = JSON.parse(result.rows[i].geometria);
              }
              // Pedir el source mas cercano al target
              query = "SELECT vias.source, \
                          ST_DISTANCE( locations.geom::geography, ST_SETSRID( ST_MAKEPOINT( vias.x1 , vias.y1 ) , 4326 )::geography ) AS dist, \
                          ST_AsGeoJSON( ST_MAKELINE( ST_CLOSESTPOINT( locations.geom , vias.the_geom ) , ST_SETSRID( ST_MAKEPOINT( vias.x1 , vias.y1 ) , 4326 ) ) ) AS geometria \
                          FROM \
                          location AS locations, ways AS vias \
                          WHERE \
                          locations.id = " + idTargetLocation + " \
                          AND ST_BUFFER( locations.geom::geography , 100)::geometry && vias.the_geom \
                          ORDER BY dist ASC \
                          LIMIT 1";
              client.query(query, [], function(err, result){
                done();
                if(err){
                  cb(err, null);
                }else{
                  for(var i=0; i<result.rows.length;i++){
                    sourceTarget = result.rows[i].source;
                    sourceTargetDistancia = result.rows[i].dist;
                    sourceTargetGeom = JSON.parse(result.rows[i].geometria);
                  }
                  // Pedir el target mas cercano al lugar de comida
                  query = "SELECT vias.target, \
                                  ST_DISTANCE( locations.geom::geography, ST_SETSRID( ST_MAKEPOINT( vias.x2 , vias.y2 ) , 4326 )::geography ) AS dist, \
                                  ST_AsGeoJSON( ST_MAKELINE( ST_CLOSESTPOINT( locations.geom , vias.the_geom ) , ST_SETSRID( ST_MAKEPOINT( vias.x2 , vias.y2 ) , 4326 ) ) ) AS geometria \
                                  FROM \
                                  location AS locations, ways AS vias \
                                  WHERE \
                                  locations.id = " + idTargetLocation + " \
                                  AND ST_BUFFER( locations.geom::geography , 100)::geometry && vias.the_geom \
                                  ORDER BY dist ASC \
                                  LIMIT 1";
                  client.query(query, [], function(err,result){
                    done();
                    if(err){
                      cb(err, null);
                    }else{
                      for (var i = 0; i < result.rows.length; i++){
                        targetTarget = result.rows[i].target;
                        targetTargetDistancia = result.rows[i].dist;
                        targetTargetGeom = JSON.parse(result.rows[i].geometria);
                      }
                // Decidir dependiendo de cual esta mas cerca del origen, si escoger el source o target
                      var sourceStart;
                      var feature;
                      if (targetSourceDistancia > sourceSourceDistancia){
                        sourceStart = sourceSource;
                        totalDistance += sourceSourceDistancia;
                        feature = { "type": "Feature",
                        "geometry": sourceSourceGeom};
                        geojson.features.push(feature);
                      }else {
                        sourceStart = targetSource;
                        totalDistance += targetSourceDistancia;
                        feature = { "type": "Feature",
                                    "geometry": targetSourceGeom}
                                  };
                        geojson.features.push(feature);
                      }

                      var targetEnd;
                      if (targetTargetDistancia > sourceTargetDistancia){
                          targetEnd = sourceTarget;
                          totalDistance += sourceTargetDistancia;
                          feature = { "type": "Feature",
                                      "geometry": sourceTargetGeom};
                          geojson.features.push(feature);
                      } else {
                          targetEnd = targetTarget;
                          totalDistance += targetTargetDistancia;
                          feature = { "type": "Feature",
                                      "geometry": targetTargetGeom};
                          geojson.features.push(feature);
                      }
                      query = "SELECT seq, id1 AS node, id2 AS edge, cost * 1000 AS cost \
                                  ,ST_AsGeoJSON(the_geom) AS geometria \
                                  FROM \
                                  pgr_dijkstra( 'SELECT gid AS id, source, target, length AS cost FROM ways', \
                                  " + sourceStart + ", \
                                  " + targetEnd + ", \
                                  false, \
                                  false\) \
                                  ,ways AS vias \
                                  WHERE \
                                  id2 = vias.gid";
                        client.query(query ,[],function(err,result){
                          done();
                          if(err){
                            cb(err,null);
                          }else{
                            for (var i = 0; i < result.rows.length; i++){
                              totalDistance += result.rows[i].cost;
                              feature = { "type": "Feature",
                                          "geometry": JSON.parse(result.rows[i].geometria)};
                              geojson.features.push(feature);
                            }
                            cb(null,geojson);
                          }
                      });


                  });
                }
              });

            }
          });
        }
      });
    });
  }

}