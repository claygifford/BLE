angular.module('lbxApp')
.controller('sellerAcceptController', ['$scope', '$uibModalInstance', 'ClientContext', 'bid', function ($scope, $uibModalInstance, ClientContext, bid) {

	$scope.bid = bid;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.accept = function() {
		$scope.actions.isBusy = true;
		ClientContext.sellerAcceptBid($scope.bid.Id).then(function (result) {
			$scope.actions.isBusy = false;
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};
}]);