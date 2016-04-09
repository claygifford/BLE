angular.module('lbxApp')
.controller('homeProfileController', ['$window', '$scope', 'ClientContext', function ($window, $scope, ClientContext) {

	$scope.editMode = false;
	$scope.editAppUser = {};
	$scope.AppUser = ClientContext.AppUser;

	$scope.toggleEdit = function() {
		var appUser = angular.copy(ClientContext.AppUser);
		appUser.ConfirmPassword = appUser.Password;
		$scope.editAppUser = appUser;
		$scope.editMode = !$scope.editMode;
	}

	$scope.cancel = function() {
		$scope.editMode = false;
		
		var element = $('#update-account');
        var fv = element.data('formValidation');
        fv.resetForm();
	};

	$scope.updateAccount = function(fv) {
  		var editAppUser = $scope.editAppUser;
  		ClientContext.updateAppUser(editAppUser).then(function(result) {

			if (result.isSuccess) {
				var element = $('#update-account');
        		var fv = element.data('formValidation');
        		fv.resetForm();
				$scope.AppUser = ClientContext.AppUser;
				$scope.editMode = !$scope.editMode;
			}
			else {
				if (result.data.fields !== undefined) {
					for (var field in result.data.fields) {
		            	fv
		                .updateMessage(field, 'blank', result.data.fields[field])		                
	                	.updateStatus(field, 'INVALID', 'blank');
		        	}	
				}
			}
  		});
	};

	$scope.getCompanies = function (val) {
		return ClientContext.findCompanies(val).then(function (result) {
	 		if (result.isSuccess) {
	 			return result.data;
			}
	 	});;
	};
}]);