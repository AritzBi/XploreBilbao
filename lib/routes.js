'use strict';

var api = require('./controllers/api'),
    session= require('./controllers/session'),
    users = require('./controllers/members'),
    pintxos = require('./controllers/pintxos'),
    pintxosCategory = require('./controllers/pintxosCategory'),
    index = require('./controllers');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  //Users
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);
  //Pintxos
  app.get('/api/pintxos', pintxos.list);
  app.get('/api/pintxos/:id', pintxos.get);
  //PintxosCategory
  app.get('/api/pintxosCategory', pintxosCategory.list);
  app.get('/api/pintxosCategory/:id', pintxosCategory.get);
  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.post('/api/session',session.login);
  app.del('/api/session',session.logout);
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
  app.get('/login');
  app.get('/signUp');
};