var hosteleryComments =require('../models/hosteleryComments');


exports.list = function (req, res, next) {
  console.log("oleoleoloe");
  var hosteleryId = req.params.id;

  hosteleryComments.findByHosteleryId(hosteleryId, function (err, comments) {
    if (err) return next(err);
    if (!comments) return res.send(404);
    res.json(comments);
  });
};

exports.update = function (req, res, next) {
  console.log(req.body);
  hosteleryComments.updateComment(req.body, function (err) {
		if (err) return res.send(400);
		res.send(200);
  });
};

exports.create = function (req, res, next) {
  console.log(req.user);
  hosteleryComments.createComment(req.body,req.user.id, function (err, comment) {
    if (err) return next(err);
    if (!comment) return res.send(404);
    res.json(comment);
  });
};

