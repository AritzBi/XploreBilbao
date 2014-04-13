var pg=require('pg');
var conString="postgres://doctor:who@localhost:5432/mydb";
var auth=


module.exports = {
	findById: function(id, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM MEMBER WHERE ID=$1";
			client.query(query, [id], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						done();
						cb(new Error("Usuario no encontrado"),null);
					}else{
						done();
						cb(null, result.rows);
					}
				}
			})

		});
	},
	findByUsername: function(username, cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM MEMBER WHERE USERNAME=$1";
			client.query(query, [username], function(err,result){
				if(err){
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						cb(null,null);
					}else{
						cb(null, result.rows);
					}
				}
			})

		});
	},
	findAll: function(cb){
		pg.connect(conString, function(err,client,done){
			query="SELECT * FROM MEMBER";
			client.query(query, [], function(err,result){
				if(err){
					cb(err, null);
				}else{
					if(result.rows.length<=0){
						cb(new Error("No hay ningún usuario en la base de datos."),null);
					}else{
						cb(null, result.rows);
					}
				}
			})

		});
	},
	changePassword: function(id, newPassword, cb){
		pg.connect(conString, function(err, client, done){
			query="UPDATE MEMBER SET PASSWORD=$1 WHERE ID=$2";
			client.query(query, [newPassword,id], function(err){
				if(err){
					cb(err);
				}else{
					cb(null);
				}
			})
		});	
	},
	createUser: function(values, cb){
		pg.connect(conString,function(err, client, done){
			query="INSERT INTO MEMBER (EMAIL,USERNAME, HASH, SALT, NAME, SURNAME) VALUES ($1,$2,$3,$4,$5,$6) returning ID";
			client.query(query,[values.email,values.username, values.hash, values.salt, values.name, values.surname], function(err, result){
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