angular.module('lbxApp')
.controller('saveSearchController', ['$scope', '$uibModalInstance', 'ClientContext', 'search', function ($scope, $uibModalInstance, ClientContext, search) {

	$scope.search = search;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.close();
	}
	
	$scope.save = function(fv) {
		$scope.actions.isBusy = true;
		$scope.actions.message = null;
  		var search = {};
  		search.Name = $scope.name;
  		search.Filter = $scope.search.filter;

  		ClientContext.saveSearch(search).then(function (result) {

  			$scope.actions.isBusy = false;
  			
			if (result.isSuccess) {
				$uibModalInstance.close();
			}
			else {

			}
  		});
	};
}]);