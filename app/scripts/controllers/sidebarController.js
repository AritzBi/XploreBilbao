'use strict';

angular.module('xploreBilbaoApp')
	.controller('SidebarCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute){
		$scope.opts = {
  			disable: 'right',
  			minPosition: -500,
  			maxPosition: 500
		};
		snapRemote.getSnapper().then(function(snapper) {
			var sidebarEnabled=$cookieStore.get('sidebar');
			console.log(sidebarEnabled);
  			if(sidebarEnabled != "true")
  				snapper.disable();
		});

		$scope.enableSidebar = function() {
      snapRemote.getSnapper().then(function(snapper) {
  				$cookieStore.put('sidebar',"true");
  				snapper.enable();
			});
			 snapRemote.open('left');
    	};
    	$scope.disenableSidebar = function() {
      	snapRemote.getSnapper().then(function(snapper) {
          newRoute.reset();
  				$cookieStore.put('sidebar',"false");
  				snapper.disable();
			  });
			   snapRemote.close('left');
    	};

    	$scope.isSidebarEnabled = function() {
    		var sidebarEnabled=$cookieStore.get('sidebar');
    		if(sidebarEnabled === "true")
    			return true;
    		else return false;
    	};
	});	

angular.module('xploreBilbaoApp')
  .controller('NewRouteCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute){
    $scope.newRoute=newRoute.getRoute();
      $scope.dropCallback = function(event, ui, title, $index) {
        console.log($scope.newRoute);
    };
  }); 

angular.module('xploreBilbaoApp')
.service('newRoute',function(){
  var newRoute=[];
  this.addLocation = function(location){
    newRoute.push(location);
    console.log(newRoute);
  }
  this.getRoute = function(){
    return newRoute;
  }
  this.reset=function(){
    newRoute=[];
  }
});