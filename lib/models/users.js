var pg=require('pg');
var config = require('../config/config');


module.exports = {
	findById: function(id, cb){
		pg.connect(config.bdPath, function(err,client,done){
			query="SELECT M.ID, M.USERNAME , M.SALT, M.HASH FROM MEMBER M WHERE ID=$1";
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
		pg.connect(config.bdPath, function(err,client,done){
			query="SELECT M.ID, M.USERNAME, M.SALT, M.HASH FROM MEMBER M WHERE M.USERNAME=$1 ";
			client.query(query, [username], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					done();
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
		pg.connect(config.bdPath, function(err,client,done){
			query="SELECT * FROM MEMBER";
			client.query(query, [], function(err,result){
				if(err){
					done();
					cb(err, null);
				}else{
					done();
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
		pg.connect(config.bdPath, function(err, client, done){
			query="UPDATE MEMBER SET PASSWORD=$1 WHERE ID=$2";
			client.query(query, [newPassword,id], function(err){
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
	createUser: function(values, cb){
		pg.connect(config.bdPath,function(err, client, done){
			query="INSERT INTO MEMBER (EMAIL,USERNAME, HASH, SALT, NAME, SURNAME) VALUES ($1,$2,$3,$4,$5,$6) returning ID";
			client.query(query,[values.email,values.username, values.hash, values.salt, values.name, values.surname], function(err, result){
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