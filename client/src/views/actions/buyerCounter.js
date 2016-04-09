angular.module('lbxApp')
.controller('buyerCounterController', ['$scope', '$uibModalInstance', 'ClientContext', 'bid', function ($scope, $uibModalInstance, ClientContext, bid) {

	$scope.bid = bid;
	$scope.actions = {};
	$scope.counter = { 'NumberOfBeds' : 100, 'PricePerBed' : bid.PricePerBed };
	$scope.properties = {};

	var calculatePrice = function () {

		if ($scope.counter.PricePerBed === undefined)
			return;
		if ($scope.counter.NumberOfBeds === undefined)
			return;

		$scope.properties.Price = $scope.counter.PricePerBed * $scope.counter.NumberOfBeds;
	};

	$scope.$watch('counter.PricePerBed', function() {
		calculatePrice();
	});

	$scope.$watch('counter.NumberOfBeds', function() {
		calculatePrice();
	});

	var validator;
	$scope.validate = function(){
		if (validator === undefined)
		{
			validator = $('#counter-form').formValidation({
		        framework: 'bootstrap',
		        live: 'disabled',
		        icon: {
		            valid: 'fa fa-check-circle fa-lg text-success',
		            invalid: 'fa fa-times-circle fa-lg',
		            validating: 'fa fa-refresh'         
		        },
		        fields: {
		            pricePerBed: {
		                validators: {
		                    notEmpty: {
		                        message: 'You must enter the Price/Bed'
		                    }
		                }
		            },
		            numberOfBeds: {
						validators: {
							notEmpty: {
								message: 'You must enter the Number of Bed Licenses'
							}
						}
					}
		        }
		    });
		}
		validator.data('formValidation').validate();
		return validator.data('formValidation').isValid();
	}

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
	
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.counter = function() {
		$scope.actions.isBusy = true;

		var isValid = $scope.validate();
		if (isValid === false) {
			return;			
		}

		var request = { 'Id' : $scope.bid.Id, 'PricePerBed' : $scope.counter.PricePerBed, 'NumberOfBeds' : $scope.counter.NumberOfBeds };

		ClientContext.buyerCounterBid(request).then(function (result) {
			if (result.isSuccess) {				
				$uibModalInstance.close();
			}
		});
	};
}]);