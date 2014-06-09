'use strict';

angular.module('xploreBilbaoApp')
	.controller('SidebarCtrl', function ($scope,$rootScope, snapRemote, $cookieStore){
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
          $scope.newRoute={};
      		snapRemote.getSnapper().then(function(snapper) {
  				$cookieStore.put('sidebar',"true");
  				snapper.enable();
			});
			 snapRemote.open('left');
    	};
    	$scope.disenableSidebar = function() {
          $scope.newRoute={};
      		snapRemote.getSnapper().then(function(snapper) {
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

      $scope.addToNewRoute= function(){

      }
	});	