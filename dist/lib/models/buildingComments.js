var pg=require('pg');
var conString="postgres://xplore:bilbao@localhost:5432/xploreDB";
module.exports = {
	findByBuildingId: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM BUILDING_COMMENTS WHERE BUILDING_ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(null,[]);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			});

		});
	},
	updateComment: function(values, cb){
		pg.connect(conString, function(err, client, done){
			query="UPDATE BUILDING_COMMENTS SET COMMENT=$1, NOTE=$2 WHERE MEMBER_ID=$3 AND BUILDING_ID=$4";
			client.query(query, [ values.comment, values.note,values.member_id,values.building_id,], function(err){
				if(err){
					done();
					cb(err);
				}else{
					done();
					cb(null);
				}
			})
		});	
	},
	createComment: function(values,userId, cb){
		pg.connect(conString,function(err, client, done){
			query="INSERT INTO BUILDING_COMMENTS (MEMBER_ID, BUILDING_ID, COMMENT, NOTE) VALUES ($1,$2,$3,$4) returning ID";
			client.query(query,[userId,values.building_id, values.comment, values.note], function(err, result){
				if(err){
					done();
					cb(err,null);
				}else{
					done();
					values.id=result.rows[0].id;
					cb(null,values);
				}
			})
		});
	}
};