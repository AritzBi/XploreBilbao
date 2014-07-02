'use strict';

angular.module('xploreBilbaoApp')
	.controller('SidebarCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute){
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
    console.log(window.innerWidth);
		snapRemote.getSnapper().then(function(snapper) {
			var sidebarEnabled=$cookieStore.get('sidebar');
			console.log(sidebarEnabled);
  			if(sidebarEnabled != "true")
  				snapper.disable();
		});

		$scope.enableSidebar = function() {
      console.log("holasdfsfsdfds");
      snapRemote.getSnapper().then(function(snapper) {
  				$cookieStore.put('sidebar',"true");
  				snapper.enable();
          snapper.settings($scope.opts);
          snapper.open('left',100);
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
  .controller('NewRouteCtrl', function ($scope,$rootScope, snapRemote, $cookieStore, newRoute, Routes){
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
      Routes.save({route: newRoute}, function(){
      });
    };

    $scope.deleteItem=function(){
      console.log("holis");
    }
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