angular.module('lbxApp')
.controller('passwordReminderController', ['$window', '$scope', '$stateParams', '$state', 'ClientContext', function ($window, $scope, $stateParams, $state, ClientContext) {
	
	$scope.account = {};
	$scope.actions = {};

	$scope.goto = function(state) {
		$state.go(state);
	};

	$scope.resetPassword = function(fv) {
		$scope.actions.isBusy = true;
		$scope.actions.message = null;
  		var account = $scope.account;  		

  		ClientContext.resetPassword(account).then(function (result) {

  			$scope.actions.isBusy = false;
  			
			if (result.isSuccess) {
				ClientContext.goToCurrentState();
			}
			else {
				if (result.data != null && result.data.fields !== undefined) {
					for (var field in result.data.fields) {
		            	fv
		                .updateMessage(field, 'blank', result.data.fields[field])		                
	                	.updateStatus(field, 'INVALID', 'blank');
		        	}
		        	$scope.actions.message = result.data.message;	
				} else {
					$scope.actions.message = "Reset Password attempt failed. Please try again.";
				}
			}
  		});
	};
}]);