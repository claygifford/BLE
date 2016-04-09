angular.module('lbxApp')
.controller('homeController', ['$window', '$scope', '$stateParams', '$state', function ($window, $scope, $stateParams, $state) {
	
	$scope.goto = function(state)
	{
		$state.go(state);	
	}
}]);