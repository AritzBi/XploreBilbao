'use strict';

var api = require('./controllers/api'),
    session= require('./controllers/session'),
    users = require('./controllers/members'),
    hostelery=  require('./controllers/hostelery'),
    hosteleryTypes= require('./controllers/hosteleryTypes'),
    hosteleryComments = require('./controllers/hosteleryComments'),
    emblematicBuildings = require('./controllers/emblematicBuildings'),
    buildingTypes = require('./controllers/buildingTypes'),
    buildingComments = require('./controllers/buildingComments'),
    events = require('./controllers/events'),
    eventsCategory = require('./controllers/eventsCategory'),
    routes = require('./controllers/routes'),
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
  app.get('/api/pintxos', hostelery.listPintxos);
  app.get('/api/pintxos/:id', hostelery.get);
  //PintxosCategory
  app.get('/api/pintxosCategory', hosteleryTypes.listPintxosCategory);
  app.get('/api/pintxosCategory/:id', hosteleryTypes.get);
  //Pintxos
  app.get('/api/restaurants', hostelery.listRestaurants);
  app.get('/api/restaurants/:id', hostelery.get);
  //PintxosCategory
  app.get('/api/restaurantsCategory', hosteleryTypes.listRestaurantsCategory);
  app.get('/api/restaurantsCategory/:id', hosteleryTypes.get);
  //HosteleryComments
  //app.get('/api/hosteleryComments', hosteleryComments.list);
  app.get('/api/hosteleryComments/:id', hosteleryComments.list);
  app.put('/api/hosteleryComments/:id', hosteleryComments.update);
  app.post('/api/hosteleryComments', hosteleryComments.create);
  //Emblematic Buildings
  app.get('/api/emblematicBuildings', emblematicBuildings.list);
  app.get('/api/emblematicBuildings/:id', emblematicBuildings.get);
  //Building Types
  app.get('/api/buildingTypes', buildingTypes.list);
  app.get('/api/buildingTypes/:id', buildingTypes.get);
  //Building comments
  app.get('/api/buildingComments/:id', buildingComments.list);
  app.put('/api/buildingComments/:id', buildingComments.update);
  app.post('/api/buildingComments', buildingComments.create);
  //Events
  app.get('/api/events/:id', events.get);
  app.get('/api/events', events.list);
  //Events category
  app.get('/api/eventsCategory/:id', eventsCategory.get);
  app.get('/api/eventsCategory', eventsCategory.list);
  //Public Transport Information
  app.get('/api/routes/getSubwayLines', routes.getSubwayLines);
  app.get('/api/routes/getSubwayEntrances', routes.getSubwayEntrances);
  app.get('/api/routes/getTramLines', routes.getTramLines);
  app.get('/api/routes/getTramStops', routes.getTramStops);
  app.get('/api/routes/getWalkRoute', routes.getWalkRoute);
  app.get('/api/routes/getInfoRoutes', routes.getInfoRoutes);
  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.post('/api/session',session.login);
  app.del('/api/session',session.logout);
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/language/*', index.language);
  app.get('/*', middleware.setUserCookie, index.index);
  app.get('/login');
  app.get('/signUp');
};