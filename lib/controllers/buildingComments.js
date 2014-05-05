var buildingComments =require('../models/buildingComments');


exports.list = function (req, res, next) {
  var buildingId = req.params.id;

  buildingComments.findByBuildingId(buildingId, function (err, comments) {
    if (err) return next(err);
    if (!comments) return res.send(404);
    res.json(comments);
  });
};

exports.update = function (req, res, next) {
  buildingComments.updateComment(req.body, function (err) {
		if (err) return res.send(400);
		res.send(200);
  });
};

exports.create = function (req, res, next) {
  buildingComments.createComment(req.body,req.user.id, function (err, comment) {
    if (err) return next(err);
    if (!comment) return res.send(404);
    res.json(comment);
  });
};

