'use strict';

var path = require('path');
var fs = require('fs');

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      console.log("Error rendering partial '" + requestedView + "'\n", err);
      res.status(404);
      res.send(404);
    } else {
      res.send(html);
    }
  });
};

exports.language = function(req,res ){
  var lang=req.param('lang');
  var requestedLanguage=__dirname+'/../../app/languages/'+lang+'.json';
  /*res.json(requestedLanguage, function(err, json){
    if(err){
      console.log(err);
      res.status(404);
      res.send(404);
    }else{
      console.log('holasda');
      console.log(json);
      res.json(json);
    }
  });*/
  var file = fs.readFileSync(requestedLanguage);
  res.json(JSON.parse(file));
}

/**
 * Send our single page app
 */
exports.index = function(req, res) {
  res.render('index');
};
