angular.module('lbxApp')
.controller('retractBidController', ['$scope', '$uibModalInstance', 'ClientContext', 'bid', function ($scope, $uibModalInstance, ClientContext, bid) {

	$scope.bid = bid;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.retract = function() {
		$scope.actions.isBusy = true;

		ClientContext.retractBid($scope.bid.Id).then(function (result) {
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};
}]);