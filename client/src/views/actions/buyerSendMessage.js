angular.module('lbxApp')
.controller('buyerSendMessageController', ['$scope', '$uibModalInstance', 'ClientContext', 'bid', function ($scope, $uibModalInstance, ClientContext, bid) {

	$scope.bid = bid;
	$scope.actions = {};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.sendMessage = function() {
		if (!$scope.validate())
			return;

		$scope.actions.isBusy = true;

		var request = { 'BidId' : $scope.bid.Id, 'Message' : $scope.message };

		ClientContext.createMessage(request).then(function (result) {
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};

	var validator;
	$scope.validate = function(){
		if (validator === undefined)
		{
			validator = $('#message-form').formValidation({
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