angular.module('lbxApp')
.controller('retractListingController', ['$scope', '$uibModalInstance', 'ClientContext', 'listing', function ($scope, $uibModalInstance, ClientContext, listing) {

	$scope.listing = listing;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.retract = function() {
		$scope.actions.isBusy = true;

		ClientContext.retractListing($scope.listing.Id).then(function (result) {
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};
}]);