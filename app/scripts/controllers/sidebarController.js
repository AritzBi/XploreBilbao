'use strict';

angular.module('xploreBilbaoApp')
	.controller('SidebarCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute,$timeout){
		if(window.innerWidth<=768){
        $scope.opts = {
        disable: 'right',
         minPosition: -265,
         maxPosition: 265
    };
    }else{
    $scope.opts = {
  			disable: 'right',
        minPosition: -350,
        maxPosition: 350
		};}

    window.onresize = function(event) {
      snapRemote.getSnapper().then(function(snapper) {
        if(window.innerWidth<=768){
         $scope.opts = {
         disable: 'right',
         minPosition: -265,
         maxPosition: 265
        };
      }else{
        $scope.opts = {
        disable: 'right',
        minPosition: -350,
        maxPosition: 350
        };
        snapper.settings($scope.opts);
      }
      });

    };
		snapRemote.getSnapper().then(function(snapper) {
			var sidebarEnabled=$cookieStore.get('sidebar');
  			if(sidebarEnabled != "true")
  				snapper.disable();
		});

		$scope.enableSidebar = function() {
      snapRemote.getSnapper().then(function(snapper) {
  				$cookieStore.put('sidebar',"true");
  				snapper.enable();
          snapper.settings($scope.opts);
          $timeout( function(){
            snapper.open('left');
          } );
			});        

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
    		if(sidebarEnabled === "true" && $rootScope.currentUser)
    			return true;
    		else return false;
    	};
	});	

angular.module('xploreBilbaoApp')
  .controller('NewRouteCtrl', function ($scope,$rootScope, snapRemote,$modal, $cookieStore, newRoute, Routes){
    $scope.newRoute=newRoute.getRoute();
      $scope.dropCallback = function(event, ui, title, $index) {
    };

    $scope.createRoute=function(){
      var newRoute='[';
      for(var i=0; i<$scope.newRoute.length;i++){
        if($scope.newRoute[i].building_type){
          newRoute=newRoute.concat('{\"ID\": '+$scope.newRoute[i].id+', \"TYPE\": \"EMBLEMATIC_BUILDING\"},');
        }else{
          if($scope.newRoute[i].hostelery_type){
            newRoute=newRoute.concat('{\"ID\": '+$scope.newRoute[i].id+', \"TYPE\": \"HOSTELERY\"},');
          }else{
            newRoute=newRoute.concat('{\"ID\": '+$scope.newRoute[i].event_id+', \"TYPE\": \"EVENT\"},');
          }
        }
      }

      newRoute = newRoute.substring(0, newRoute.length-1);
      newRoute=newRoute.concat(']');
      var instance=$modal.open({
        templateUrl: 'partials/createRoute.html',
        controller: 'CreateRouteCtrl'
      });
      instance.result.then(function(data){
        Routes.save({name: data.name,description: data.description, route: newRoute}).$promise.then( function(success){
          $scope.disenableSidebar();
        });
      });

    };

      $scope.disenableSidebar = function() {
        snapRemote.getSnapper().then(function(snapper) {
          newRoute.reset();
          $cookieStore.put('sidebar',"false");
          snapper.close('left');
          snapper.disable();
        });
      };

    $scope.deleteItem=function(number){
      $scope.newRoute.splice(number, 1);
    }
  }); 

angular.module('xploreBilbaoApp')
  .controller('CreateRouteCtrl', function ($scope,$rootScope, snapRemote,$modalInstance, $cookieStore){
    $scope.route={};
    $scope.createRoute=function(form){
      $scope.submitted = true;
            if(form.$valid){
              $modalInstance.close($scope.route);
            }
    };

    $scope.cancel=function(){
      $modalInstance.dismiss();
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