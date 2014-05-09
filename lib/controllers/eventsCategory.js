var eventsCategory =require('../models/eventsCategory');

exports.list =function(req,res,next){
	eventsCategory.findAll(function (err,eventsCategory){
		if(!eventsCategory)return res.send(500,err);
		res.json(eventsCategory);
	});
};

exports.get =function(req,res,next){
	var id=req.params.id;
	eventsCategory.findById(id, function (err,category){
		if(!category)return res.send(500,err);
		res.json(category);
	});
};