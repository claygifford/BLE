angular.module('lbxApp')
.controller('settingsController', ['$window', '$scope', 'ClientContext', function ($window, $scope, ClientContext) {

	$scope.actions = {};
	$scope.editMode = false;
	$scope.editSettings = {};
	$scope.settings = {};

	$scope.toggleEdit = function() {
		var settings = angular.copy($scope.settings);
		$scope.editSettings = settings;
		$scope.editMode = !$scope.editMode;
	}

	$scope.cancel = function() {
		$scope.editMode = false;		
	};

	$scope.updateSettings = function(fv) {
  		var editSettings = $scope.editSettings;
  		//var fv = $('#create-account').data('formValidation');
  		ClientContext.updateSettings(editSettings).then(function(result) {

			if (result.isSuccess) {
				$scope.editMode = !$scope.editMode;	
				$scope.settings = result.data.Settings;			
				//$scope.$apply();
			}
			else {

			}
  		});
	};

  	$scope.loadSettings = function() {
  		$scope.actions.isBusy = true;

		ClientContext.getSettings().then(function (result) {
			$scope.actions.isBusy = false;
			if (result.isSuccess) {
				$scope.settings = result.data;
			}
		});
	};

	$scope.loadSettings();
}]);