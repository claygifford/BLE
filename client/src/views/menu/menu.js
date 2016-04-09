angular.module('lbxApp')
.controller('menuController', ['$window', '$scope', '$stateParams', '$state', 'ClientContext', function ($window, $scope, $stateParams, $state, ClientContext) {

	$scope.ClientContext = ClientContext;

	$scope.goto = function(state) {
		$state.go(state);
	};

	$scope.signOut = function() {
		ClientContext.signOut();
	};
	
	$scope.currentState = function() {
		return ClientContext.currentState;
	};

	$scope.getStats = function() {
		ClientContext.getUserStats();
	};

	$scope.getStats();
}]);