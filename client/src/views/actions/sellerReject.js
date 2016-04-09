angular.module('lbxApp')
.controller('sellerRejectController', ['$scope', '$uibModalInstance', 'ClientContext', 'bid', function ($scope, $uibModalInstance, ClientContext, bid) {

	$scope.bid = bid;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.reject = function() {
		$scope.actions.isBusy = true;
		ClientContext.sellerRejectBid($scope.bid.Id).then(function (result) {
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};
}]);