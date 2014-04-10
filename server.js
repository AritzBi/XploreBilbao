'use strict';

var express = require('express')
	,db = require('./lib/models'),
	members=require('./lib/controllers/members');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);
// Start server
db
	.sequelize
	.sync({force: true})
	.complete(function(err){
		if(err){
			throw err;
		}else{
			app.listen(config.port, function () {
  				console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
			});
		}
	});
// Expose app
exports = module.exports = app;