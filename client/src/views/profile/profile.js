angular.module('lbxApp')
.controller('profileController', ['$window', '$scope', '$state', 'ClientContext', function ($window, $scope, $state, ClientContext) {

	$scope.goto = function(state) {
		$state.go(state);
	};

	$scope.currentState = function() {
		return ClientContext.currentState;
	};

	$scope.currentStateContains = function(state) {
		var currentState = String(ClientContext.currentState);
		return currentState.indexOf(state) > -1;
	};


	$scope.ClientContext = ClientContext;
}]);