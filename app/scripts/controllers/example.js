
angular.module('exampleApp')
  .controller('UserCtrl', function ($scope) {
  	$scope.users=[{name: "John", surname:"Smith"}, {name: "Jack", surname: "Sparrow"}, {name: "David", surname: "Tennant"}];
});