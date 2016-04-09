
angular.module('lbxApp')
.controller('requestInformationController', ['$scope', '$uibModalInstance', 'ClientContext', 'listing', function ($scope, $uibModalInstance, ClientContext, listing) {

	$scope.listing = listing;
	$scope.actions = {};
	$scope.request = {};

	$scope.cancel = function(){
	 	$uibModalInstance.close();	 	
	}

	$scope.submit = function(){

		if (!$scope.validate())
			return;

		$scope.actions.isBusy = true;
		$scope.actions.message = null;

		var request = {};
		request.ListingId = $scope.listing.Id;
		request.Message = $scope.request.Message;

		ClientContext.requestInformation(request).then(function (result) {

			$scope.actions.isBusy = false;

			$uibModalInstance.close();
		});		
	}
	  
	var validator;
	$scope.validate = function(){
		if (validator === undefined)
		{
			validator = $('#request-form').formValidation({
		        framework: 'bootstrap',
		        live: 'disabled',
		        icon: {
		            valid: 'fa fa-check-circle fa-lg text-success',
		            //invalid: 'fa fa-times-circle fa-lg',
		            validating: 'fa fa-refresh'         
		        },
		        fields: {
		            message: {
						validators: {
							notEmpty: {
								message: 'You must enter a Message'
							}
						}
					}
		        }
		    });
		}
		validator.data('formValidation').validate();
		return validator.data('formValidation').isValid();
	}
}]);