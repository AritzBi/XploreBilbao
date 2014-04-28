var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
module.exports = {
	findByHosteleryId: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM HOSTELERY_COMMENTS WHERE HOSTELERY_ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("No hay comentarios sobre ese centro"),null);
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
			query="UPDATE HOSTELERY_COMMENTS SET COMMENT=$1, NOTE=$2 WHERE MEMBER_ID=$3 AND HOSTELERY_ID=$4";
			client.query(query, [values.member_id,values.hostelery_id, values.comment, values.note], function(err){
				if(err){
					cb(err);
				}else{
					cb(null);
				}
			})
		});	
	},
	createComment: function(values,userId, cb){
		pg.connect(conString,function(err, client, done){
			query="INSERT INTO HOSTELERY_COMMENTS (MEMBER_ID, HOSTELERY_ID, COMMENT, NOTE) VALUES ($1,$2,$3,$4) returning ID";
			client.query(query,[userId,values.hostelery_id, values.comment, values.note], function(err, result){
				if(err){
					cb(err,null);
				}else{
					values.id=result.rows[0].id;
					cb(null,values);
				}
			})
		});
	}
};