var hosteleryComments =require('../models/hosteleryComments');
var hostelery =require('../controllers/hostelery');

exports.list = function (req, res, next) {
  var hosteleryId = req.params.id;

  hosteleryComments.findByHosteleryId(hosteleryId, function (err, comments) {
    if (err) return next(err);
    if (!comments) return res.send(404);
    res.json(comments);
  });
};

exports.update = function (req, res, next) {
  hosteleryComments.updateComment(req.body, function (err) {
		if (err) return res.send(400);
    hostelery.getNote(req.body.hostelery_id, function(err, note){
      if (err) return res.send(400);
      console.log(note);
      res.json(note);
    });
  });
};

exports.create = function (req, res, next) {
  hosteleryComments.createComment(req.body,req.user.id, function (err, comment) {
    if (err) return next(err);
    if (!comment) return res.send(404);
    hostelery.getNote(req.body.hostelery_id, function(err, note){
      if (err) return res.send(400);
      comment.avg=note.avg;
      res.json(comment);
    });
  });
};

