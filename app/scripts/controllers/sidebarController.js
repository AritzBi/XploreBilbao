'use strict';

angular.module('xploreBilbaoApp')
	.controller('SidebarCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute){
		$scope.opts = {
  			disable: 'right',
  			minPosition: -400,
  			maxPosition: 400
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
    };

    $scope.createRoute=function(){
      var newRoute=[];
      for(var i=0; i<$scope.newRoute.length;i++){
        
      }
    };
  }); 

angular.module('xploreBilbaoApp')
.service('newRoute',function(){
  var newRoute=[];
  this.addLocation = function(location){
    newRoute.push(location);
  }
  this.getRoute = function(){
    return newRoute;
  }
  this.reset=function(){
    newRoute.length=0;
  }
});