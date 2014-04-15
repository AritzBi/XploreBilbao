var pintxo =require('../models/pintxos');

exports.list =function(req,res,next){
	pintxo.findAll(function (err,pintxos){
		if(!pintxos)return res.send(500,err);
		res.json(pintxos);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	pintxo.findById(id, function (err,pintxo){
		console.log(err);
		if(!pintxo)return res.send(500,err);
		res.json(pintxo);
	});
};