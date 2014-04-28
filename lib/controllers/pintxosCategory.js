var pintxosCategory =require('../models/pintxosCategory');

exports.list =function(req,res,next){
	pintxosCategory.findAll(function (err,pintxosCategory){
		if(!pintxosCategory)return res.send(500,err);
		res.json(pintxosCategory);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	pintxosCategory.findById(id, function (err,category){
		if(!category)return res.send(500,err);
		res.json(category);
	});
};